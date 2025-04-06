let questionsAndAnswers = {}; // Store questions and answers

// Fetch existing questions from the server
function fetchQuestions() {
  fetch('http://127.0.0.1:5000/get_questions')
    .then((response) => response.json())
    .then((data) => {
      questionsAndAnswers = data.questions_and_answers || {};
      updateQuestionsList();
    })
    .catch((error) => {
      console.error('Error fetching questions:', error);
    });
}

// Add a new question field dynamically
function addQuestionField() {
  const questionFields = document.getElementById('questionFields');

  const newField = document.createElement('div');
  newField.classList.add('question-field');
  newField.innerHTML = `
    <label for="question">Question:</label>
    <input type="text" class="question" placeholder="Enter the question" required>

    <label for="answer">Answer:</label>
    <input type="text" class="answer" placeholder="Enter the answer" required>
  `;

  questionFields.appendChild(newField);
}

// Save all questions to the server
function saveQuestions() {
  const questionInputs = document.querySelectorAll('.question');
  const answerInputs = document.querySelectorAll('.answer');

  // Fetch existing questions and merge with new ones
  questionInputs.forEach((questionInput, index) => {
    const question = questionInput.value.trim();
    const answer = answerInputs[index].value.trim();

    if (question && answer) {
      questionsAndAnswers[question] = answer; // Add or update the question
    }
  });

  fetch('http://127.0.0.1:5000/update_questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questions_and_answers: questionsAndAnswers }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message || 'Questions saved successfully!');
      updateQuestionsList();
    })
    .catch((error) => {
      console.error('Error saving questions:', error);
      alert('An error occurred while saving questions.');
    });
}

// Update the questions list in the UI with numbering
function updateQuestionsList() {
  const questionsList = document.getElementById('questionsList');
  questionsList.innerHTML = '';

  let questionNumber = 1; // Start numbering from 1
  for (const [question, answer] of Object.entries(questionsAndAnswers)) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${questionNumber}. ${question} - <strong>${answer}</strong></span>
      <button onclick="deleteQuestion('${question}')">Delete</button>
    `;
    questionsList.appendChild(listItem);
    questionNumber++; // Increment the question number
  }
}

// Delete a question
function deleteQuestion(question) {
  delete questionsAndAnswers[question];
  updateQuestionsList();
}

// Load questions when the page loads
window.onload = fetchQuestions;