// Function to grade the uploaded answers
function gradeAnswers() {
  const fileInput = document.getElementById('answerFile');
  const resultDiv = document.getElementById('result');

  // Check if a file is selected
  if (!fileInput.files.length) {
    resultDiv.textContent = "Please upload a PDF file containing your answers.";
    resultDiv.style.color = "red";
    return;
  }

  const file = fileInput.files[0];

  // Ensure the uploaded file is a PDF
  if (file.type !== "application/pdf") {
    resultDiv.textContent = "Only PDF files are allowed.";
    resultDiv.style.color = "red";
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  // Send the PDF file to the backend for processing
  fetch('http://127.0.0.1:5000/grade_pdf', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        resultDiv.textContent = `Error: ${data.error}`;
        resultDiv.style.color = "red";
      } else {
        resultDiv.textContent = `Grade: ${data.grade} (${data.correct}/${data.total} correct answers)`;
        resultDiv.style.color = "green";
      }
    })
    .catch(error => {
      resultDiv.textContent = "An error occurred while grading the answers.";
      resultDiv.style.color = "red";
      console.error("Error:", error);
    });
}