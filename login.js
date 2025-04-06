async function login(role) {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    if (!username || !password) {
        errorDiv.textContent = '❌ Please fill in all fields.';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }) 
        });

        const result = await response.json();

        if (response.ok) {
            alert('✅ Login successful!');
            sessionStorage.setItem('studentName', username);
            sessionStorage.setItem('teacherName',username);
            sessionStorage.setItem('studentEmail',result.email);
        
            window.location.href = role === 'student' ? 'student.html' : 'teacher_dashboard.html';
        } else {
            alert('❌ Login failed.');
            errorDiv.textContent = result.message;
        }
    } catch (error) {
        console.error('❌ Error during login:', error);
        errorDiv.textContent = '❌ Server error. Please try again.';
    }
}

async function forgotPassword(role) {
    const email = prompt(`Enter your ${role} email:`);

    if (!email) {
        alert("❌ Please enter your email.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, role })
        });

        const result = await response.json();
        alert(result.message);

        if (result.success) {
            const otp = prompt("Enter the OTP sent to your email:");
            const newPassword = prompt("Enter your new password:");

            if (!otp || !newPassword) {
                alert("❌ OTP and password are required.");
                return;
            }

            const verifyResponse = await fetch("http://localhost:3000/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword, role })
            });

            const verifyResult = await verifyResponse.json();
            alert(verifyResult.message);
        }

    } catch (error) {
        console.error("❌ Forgot Password Error:", error);
        alert("❌ Server error. Please try again.");
    }
}
