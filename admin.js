document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();
});

// Fetch users from MongoDB
function fetchUsers() {
    fetch("http://localhost:5000/users")
        .then(response => response.json())
        .then(users => {
            window.allUsers = users; // Store users globally for search functionality
            displayUsers(users);
        })
        .catch(error => console.error("Error fetching users:", error));
}

// Function to display users in the table
function displayUsers(users) {
    const tableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    users.forEach(user => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="resetPassword('${user.username}')">Reset Password</button>
            </td>
            <td>
                <button onclick="deleteUser('${user.username}')">Delete Account</button>
            </td>
        `;
    });
}

// Function to search for a user by username
function searchUser() {
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
    const filteredUsers = window.allUsers.filter(user => user.username.toLowerCase().includes(searchInput));

    if (filteredUsers.length > 0) {
        displayUsers(filteredUsers);
    } else {
        alert("Username not found!");
    }
}

// Function to reset password
function resetPassword(username) {
    const newPassword = prompt(`Enter new password for ${username}`);
    if (newPassword) {
        fetch("http://localhost:5000/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, newPassword })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchUsers();
        })
        .catch(error => console.error("Error:", error));
    }
}

// Function to delete user
function deleteUser(username) {
    if (confirm(`Are you sure you want to delete ${username}?`)) {
        fetch("http://localhost:5000/delete-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchUsers();
        })
        .catch(error => console.error("Error:", error));
    }
}

// Function to handle sign out
function signOut() {
    window.location.href = "login.html";
}
