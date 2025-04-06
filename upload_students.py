from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import os
import PyPDF2  # For PDF processing
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# MongoDB Connection
client = MongoClient("mongodb+srv://Rohit:123@cluster0.uzahp.mongodb.net/GDG?retryWrites=true&w=majority")
db = client["GDG"]
total_students_collection = db["TotalStudent"]
dashboard_collection = db["dashboard"]  # Dashboard collection to check submission status

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("students.html")  # Ensure this file exists

@app.route("/upload_file", methods=["POST"])
def upload_file():
    """Handles file upload, extracts student names from Excel or PDF, and stores them in MongoDB."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    student_names = []  # Store extracted names

    try:
        if file.filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(file_path)
            if "Name" not in df.columns:
                return jsonify({"error": "Excel file must contain a 'Name' column"}), 400
            student_names = df["Name"].dropna().unique().tolist()

        elif file.filename.endswith(".pdf"):
            with open(file_path, "rb") as pdf_file:
                reader = PyPDF2.PdfReader(pdf_file)
                text = " ".join([page.extract_text() for page in reader.pages if page.extract_text()])
                student_names = text.split("\n")

        else:
            return jsonify({"error": "Invalid file format (only .xlsx and .pdf allowed)"}), 400

        student_names = list(filter(None, set(student_names)))  # Remove empty names and duplicates
        existing_count = total_students_collection.count_documents({})

        students_to_add = []
        for i, name in enumerate(student_names):
            if not total_students_collection.find_one({"name": name}):
                students_to_add.append({
                    "sl_no": existing_count + i + 1,
                    "name": name
                })

        if students_to_add:
            total_students_collection.insert_many(students_to_add)

        return jsonify({"message": "Students added successfully", "students": student_names}), 201

    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

    finally:
        os.remove(file_path)  # Cleanup uploaded file

@app.route("/get_students", methods=["GET"])
def get_students():
    """Fetch students from TotalStudent collection and check submission status from the dashboard collection."""
    try:
        students = list(total_students_collection.find({}, {"_id": 0, "sl_no": 1, "name": 1}))

        # Get all submitted students from dashboard
        submitted_students = set(student["name"] for student in dashboard_collection.find({}, {"_id": 0, "name": 1}))

        # Update each student with submission status
        for student in students:
            student["submitted"] = "✅ Yes" if student["name"] in submitted_students else "❌ No"

        return jsonify(students), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch students: {str(e)}"}), 500

@app.route("/delete_student", methods=["POST"])
def delete_student():
    """Deletes a student from the database by name."""
    try:
        data = request.json
        name = data.get("name")

        if not name:
            return jsonify({"error": "Student name required"}), 400

        result = total_students_collection.delete_one({"name": name})

        if result.deleted_count > 0:
            return jsonify({"message": f"✅ {name} deleted successfully!"}), 200
        else:
            return jsonify({"error": f"⚠️ {name} not found in the database!"}), 404

    except Exception as e:
        return jsonify({"error": f"⚠️ Server error while deleting student: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5005)
