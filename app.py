from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import os
from pdf2image import convert_from_path
import pytesseract
from PIL import Image
import json
import requests
from difflib import SequenceMatcher
from pymongo import MongoClient  # ✅ Import MongoDB Client

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# 🔍 MongoDB Connection
MONGO_URI = "mongodb+srv://Rohit:123@cluster0.uzahp.mongodb.net/GDG?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client["GDG"]
dashboard_collection = db["dashboard"]  # ✅ Collection to store student grades

# File to store questions and answers
QUESTIONS_FILE = "questions_and_answers.json"

# Gemini API endpoint and key
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
GEMINI_API_KEY = "AIzaSyDFcpnI7OdNGtuTJ7VpSFUVX3s8xc-Pd4I"

# Load questions and answers from the file
def load_questions():
    if os.path.exists(QUESTIONS_FILE):
        with open(QUESTIONS_FILE, "r") as file:
            return json.load(file)
    return {}

# Save questions and answers to the file
def save_questions(questions_and_answers):
    with open(QUESTIONS_FILE, "w") as file:
        json.dump(questions_and_answers, file)

# Initialize questions and answers
questions_and_answers = load_questions()

# Helper function to perform fuzzy matching
def is_similar(answer1, answer2, threshold=0.8):
    return SequenceMatcher(None, answer1, answer2).ratio() >= threshold

# Generate short feedback using Gemini API for wrong answers only
def get_feedback(wrong_answers):
    try:
        prompt = "Provide very short and precise feedback (1-2 sentences) for each of the following incorrect answers. Include the correct answer as part of the feedback:\n"
        for answer in wrong_answers:
            prompt += f"Q: {answer['question']}\n"
            prompt += f"Your Answer: {answer['user_answer']}\n"
            prompt += f"Correct Answer: {answer['correct_answer']}\n\n"

        headers = {"Content-Type": "application/json"}
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        url_with_key = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
        response = requests.post(url_with_key, json=payload, headers=headers)
        feedback = response.json()
        
        return feedback.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No feedback available.")
    
    except Exception as e:
        print(f"Error fetching feedback: {e}")
        return "Error generating feedback. Please try again."

@app.route('/grade_pdf', methods=['POST'])
def grade_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        student_name = request.form.get("student_name", "Unknown")  # ✅ Get student name

        if not file.filename.endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are allowed'}), 400

        # ✅ Check if student already submitted
        if dashboard_collection.find_one({"student_name": student_name}):
            return jsonify({'error': 'Already submitted'}), 400

        file_path = os.path.join('temp', file.filename)
        os.makedirs('temp', exist_ok=True)
        file.save(file_path)

        text = ""
        try:
            with open(file_path, 'rb') as pdf_file:
                reader = PyPDF2.PdfReader(pdf_file)
                for page in reader.pages:
                    text += page.extract_text()
        except:
            images = convert_from_path(file_path)
            for image in images:
                text += pytesseract.image_to_string(image)

        os.remove(file_path)

        if not text.strip():
            return jsonify({'error': 'No text could be extracted from the PDF'}), 400

        answers = [line.strip().lower().replace('.', '').replace(',', '').replace('  ', ' ') 
                   for line in text.split('\n') if line.strip()]
        correct_answers = [answer.lower().strip().replace('.', '').replace(',', '').replace('  ', ' ') 
                           for answer in questions_and_answers.values()]
        questions = list(questions_and_answers.keys())

        correct_count = 0
        total_questions = len(questions_and_answers)
        wrong_answers = []

        for i, question in enumerate(questions):
            user_answer = answers[i] if i < len(answers) else ""
            correct_answer = correct_answers[i]

            if is_similar(user_answer, correct_answer):
                correct_count += 1
            else:
                wrong_answers.append({
                    "question": question,
                    "user_answer": user_answer,
                    "correct_answer": correct_answers[i]
                })

        percentage = (correct_count / total_questions) * 100
        if percentage >= 90:
            grade = "A"
        elif percentage >= 75:
            grade = "B"
        elif percentage >= 50:
            grade = "C"
        else:
            grade = "F"

        feedback = get_feedback(wrong_answers) if wrong_answers else "All answers are correct!"

        # ✅ Save Student Name & Grade to MongoDB
        dashboard_collection.insert_one({
            "student_name": student_name,
            "grade": grade
        })

        return jsonify({
            'student_name': student_name,
            'grade': grade,
            'correct': correct_count,
            'total': total_questions,
            'feedback': feedback
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred while processing the file', 'details': str(e)}), 500

@app.route('/students', methods=['GET'])
def get_students():
    try:
        students = list(dashboard_collection.find({}, {"_id": 0, "student_name":1 , "grade": 1})) # Fetch student_name and grade
        return jsonify(students), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
@app.route('/get_total_students', methods=['GET'])
def get_total_students():
    try:
        total_students_collection = db["TotalStudent"]  # ✅ Fetch from 'TotalStudent' collection
        students = list(total_students_collection.find({}, {"_id": 0, "name": 1}))

        for student in students:
            # ✅ Check if student has submitted (exists in 'dashboard')
            submitted = dashboard_collection.find_one({"student_name": student["name"]})
            student["submitted"] = "Yes" if submitted else "No"

        return jsonify(students), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_total_students_count', methods=['GET'])
def get_total_students_count():
    try:
        total_students_collection = db["TotalStudent"]  # ✅ Fetch from 'TotalStudent' collection
        total_students = total_students_collection.count_documents({})  # ✅ Count total students

        return jsonify({"total_students": total_students}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_pending_assignments', methods=['GET'])
def get_pending_assignments():
    try:
        total_students_collection = db["TotalStudent"]
        students = list(total_students_collection.find({}, {"_id": 0, "name": 1}))

        pending_submissions = 0  # ✅ Counter for students who haven't submitted

        for student in students:
            submitted = dashboard_collection.find_one({"student_name": student["name"]})
            if not submitted:
                pending_submissions += 1  # ✅ Increase count if student hasn't submitted

        return jsonify({"pending_assignments": pending_submissions}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_new_messages', methods=['GET'])
def get_new_messages():
    try:
        messages_collection = db["messages"]  # Fetch from 'messages' collection
        
        # Count unread messages where read is false
        new_messages_count = messages_collection.count_documents({"read": False})
        
        return jsonify({"new_messages": new_messages_count}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/delete_student', methods=['POST'])
def delete_student():
    try:
        data = request.json
        student_name = data.get("name")

        if not student_name:
            return jsonify({"error": "Student name is required"}), 400

        total_students_collection = db["TotalStudent"]  # ✅ Connect to 'TotalStudent' collection

        # ✅ Check if the student exists
        student_exists = total_students_collection.find_one({"name": student_name})
        if not student_exists:
            return jsonify({"error": "Student not found"}), 404

        # ✅ Delete student from 'TotalStudent' collection
        total_students_collection.delete_one({"name": student_name})

        return jsonify({"message": f"Student '{student_name}' deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/update_questions', methods=['POST'])
def update_questions():
    try:
        data = request.json
        if not data or 'questions_and_answers' not in data:
            return jsonify({'error': 'Invalid data format. Expected "questions_and_answers".'}), 400

        global questions_and_answers
        questions_and_answers = data['questions_and_answers']
        save_questions(questions_and_answers)

        return jsonify({'message': 'Questions and answers updated successfully!'}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred while updating questions and answers', 'details': str(e)}), 500

@app.route('/get_questions', methods=['GET'])
def get_questions():
    try:
        return jsonify({'questions_and_answers': questions_and_answers}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred while fetching questions and answers', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
