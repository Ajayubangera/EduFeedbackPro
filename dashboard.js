document.addEventListener("DOMContentLoaded", function () {
    fetchStudents();
});

// Fetch students from MongoDB
function fetchStudents() {
    fetch("http://localhost:5000/dashboard")  // Updated port
        .then(response => response.json())
        .then(students => {
            console.log("Raw API Response:", students);
            if (!Array.isArray(students)) {
                console.error("Unexpected API response format!", students);
                return;
            }
            window.allStudents = students;
            displayStudents(students);
        })
        .catch(error => console.error("Error fetching students:", error));
}

// Function to display students in the table
function displayStudents(students) {
    const tableBody = document.querySelector("#userTable tbody");
    tableBody.innerHTML = ""; // Clear previous rows

    students.forEach(student => {
        console.log("Processing student:", student);

        if (!student.name) {  // Updated field name
            console.error("Missing student name for:", student);
            return;
        }

        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${student.name}</td>  <!-- Updated field -->
            <td>${student.grade}</td>
        `;
    });
}

// Function to search for a student by name
function searchUser() {
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
    const filteredStudents = window.allStudents.filter(student => student.name.toLowerCase().includes(searchInput));

    if (filteredStudents.length > 0) {
        displayStudents(filteredStudents);
    } else {
        alert("Student not found!");
    }
}

// Function to handle sign out
function signOut() {
    sessionStorage.clear(); 
    window.location.href = "login.html";
}
