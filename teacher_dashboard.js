// Function to update welcome message and date/time
function updateWelcomeMessage() {
  const hour = new Date().getHours();
  const welcomeEl = document.getElementById('welcomeMessage');
  const dateTimeEl = document.getElementById('dateTime');

  // Retrieve teacher's name from sessionStorage
  const teacherName = sessionStorage.getItem("teacherName") || "Teacher"; // Default to "Teacher"

  // Greeting based on time
  let greeting;
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  // Update welcome message with teacher's name
  welcomeEl.innerHTML = `${greeting}, <span id="teacherName">${teacherName}</span><br>Welcome to your teacher dashboard`;

  // Update date and time
  function updateDateTime() {
      const now = new Date();
      dateTimeEl.textContent = now.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      });
  }

  // Initial update
  updateDateTime();

  // Update every minute
  setInterval(updateDateTime, 60000);
}

// Function to fetch total students from the database
// Function to fetch and display total students
function fetchTotalStudents() {
  fetch('http://127.0.0.1:5000/get_total_students_count')  // Ensure the URL is correct
  .then(response => response.json())
  .then(data => {
      if (data.total_students !== undefined) {
          document.getElementById("total-students").textContent = data.total_students;
      } else {
          document.getElementById("total-students").textContent = "Error loading";
      }
  })
  .catch(error => {
      console.error("Error fetching total students:", error);
      document.getElementById("total-students").textContent = "Error";
  });
}

// Fetch total students when page loads
document.addEventListener("DOMContentLoaded", fetchTotalStudents);

// Call this function when the page loads
// Function to fetch pending assignments count
function fetchPendingAssignments() {
  fetch('http://127.0.0.1:5000/get_pending_assignments')  // Adjust URL if needed
  .then(response => response.json())
  .then(data => {
      if (data.pending_assignments !== undefined) {
          document.getElementById("pending-assignments").textContent = data.pending_assignments;
      } else {
          document.getElementById("pending-assignments").textContent = "Error";
      }
  })
  .catch(error => {
      console.error("Error fetching pending assignments:", error);
      document.getElementById("pending-assignments").textContent = "Error";
  });
}

// Fetch data when page loads
document.addEventListener("DOMContentLoaded", fetchPendingAssignments);

// Function to fetch new messages count
function fetchNewMessages() {
  fetch('http://127.0.0.1:5000/get_new_messages')  // Adjust URL if needed
  .then(response => response.json())
  .then(data => {
      if (data.new_messages !== undefined) {
          document.getElementById("new-messages").textContent = `${data.new_messages} New Messages`;
      } else {
          document.getElementById("new-messages").textContent = "Error";
      }
  })
  .catch(error => {
      console.error("Error fetching new messages:", error);
      document.getElementById("new-messages").textContent = "Error";
  });
}

// Fetch data when page loads
document.addEventListener("DOMContentLoaded", fetchNewMessages);



// Event Listener to run functions on page load
document.addEventListener('DOMContentLoaded', function () {
  updateWelcomeMessage();
  fetchTotalStudents(); // Fetch total students count when page loads
});

// Navigation Functions
function goHome() {
  window.location.href = "teacher_dashboard.html"; // Replace with actual home page URL
}

function logout() {
  // Add logout logic here
  alert("Logging out...");
  window.location.href = "teacherlogin.html"; // Redirect to login page
}

// Redirection Functions
function redirectToUpload() {
  window.location.href = "manage_questions.html";
}

function redirectToInbox() {
  window.location.href = "inbox.html";
}

function redirectToGrades() {
  window.location.href = "dashboard.html";
}

function redirectToStudentsName() {
  window.location.href = "students.html";
}

function redirectToManageStudents() {
  window.location.href = "students_list.html";
}

// Optional: Add interactivity or dashboard-specific functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log("Teacher Dashboard loaded successfully");
});
