// Fetch logged-in student's details from sessionStorage
document.addEventListener("DOMContentLoaded", function () {
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");

  const studentName = sessionStorage.getItem("studentName");
  const studentEmail = sessionStorage.getItem("studentEmail");

  console.log("Stored Name:", studentName); // Debugging
  console.log("Stored Email:", studentEmail); // Debugging

  if (studentName) {
    nameField.value = studentName;
  } else {
    nameField.placeholder = "Name not found. Please log in.";
  }

  if (studentEmail) {
    emailField.value = studentEmail;
  } else {
    emailField.placeholder = "Email not found. Please log in.";
  }
});

// Handle form submission (Updated to store messages in MongoDB)
document.getElementById("contactForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  if (!name || !email || !message) {
    alert("❌ All fields are required!");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/submit-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const result = await response.json();
    alert(result.message);

    if (result.success) {
      // Store name & email in sessionStorage to persist across pages
      sessionStorage.setItem("studentName", name);
      sessionStorage.setItem("studentEmail", email);

      // Clear the form
      document.getElementById("contactForm").reset();
    }
  } catch (error) {
    console.error("❌ Error sending message:", error);
    alert("❌ Server error. Please try again.");
  }
});

// Handle "Go Back" button (Unchanged)
document.getElementById("goBackBtn").addEventListener("click", function () {
  window.history.back(); // Navigate back to the previous page
});
