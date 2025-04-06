document.getElementById('uploadForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission

  const pdfFile = document.getElementById('pdfFile').files[0];
  if (!pdfFile) {
    alert('Please select a PDF file to upload.');
    return;
  }

  // Retrieve student name from sessionStorage (fallback to "Unknown")
  const studentName = sessionStorage.getItem("studentName") || "Student";

  const formData = new FormData();
  formData.append('file', pdfFile);
  formData.append('student_name', studentName); // Send student name to backend

  fetch('http://127.0.0.1:5000/grade_pdf', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        document.getElementById('result').innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
      } else {
        document.getElementById('result').innerHTML = `
          <p>Grade: ${data.grade}</p>
          <p>Correct Answers: ${data.correct} / ${data.total}</p>
        `;
        document.getElementById('feedback').innerHTML = `
          <h3>Customized Feedback:</h3>
          <p>${data.feedback}</p>
        `;

        // ✅ Save student name and grade to MongoDB
        saveGradeToDatabase(studentName, data.grade);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = `<p style="color: red;">An error occurred while grading the PDF.</p>`;
    });
});



// 📌 Function to Save Student Grade to MongoDB
function saveGradeToDatabase(studentName, grade) {
  fetch('http://127.0.0.1:5000/save_grade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ student_name: studentName, grade: grade }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Grade saved:', data.message);
    })
    .catch((error) => {
      console.error('Error saving grade:', error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  // Retrieve student name from sessionStorage (fallback to "Student")
  const studentName = sessionStorage.getItem("studentName") || "Student";

  // Update the welcome message
  document.getElementById("welcomeMessage").textContent = `Welcome, ${studentName}! Submit Your Answers`;
});
