async function register() {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const role = document.querySelector('input[name="regRole"]:checked').value;
    const errorDiv = document.getElementById('regError');

    // Input validation
    if (!username || !email || !password || !confirmPassword) {
        errorDiv.textContent = '❌ Please fill in all fields.';
        return;
    }

    if (password !== confirmPassword) {
        errorDiv.textContent = '❌ Passwords do not match.';
        return;
    }

    if (password.length < 6) {
        errorDiv.textContent = '❌ Password must be at least 6 characters.';
        return;
    }

    try {
        console.log('Attempting to register...');

        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });

        const result = await response.json();
        console.log('Response from server:', result);

        if (response.ok) {
            alert('✅ Registration successful! ');

            // Redirect based on role
            if (role === 'student') {
                window.location.href = 'studentlogin.html';
            } else if (role === 'teacher') {
                window.location.href = 'teacherlogin.html';
            }
        } else {
            errorDiv.textContent = result.message;
        }
    } catch (error) {
        console.error('❌ Error during registration:', error);
        errorDiv.textContent = '❌ Server error. Please try again.';
    }
}

// Password toggle function
function togglePasswordVisibility(icon) {
    let input = icon.previousElementSibling;
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
}
