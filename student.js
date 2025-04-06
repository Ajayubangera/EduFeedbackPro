// Function to update welcome message and date/time
function updateWelcomeMessage() {
    const hour = new Date().getHours();
    const welcomeEl = document.getElementById('welcomeMessage');
    const dateTimeEl = document.getElementById('dateTime');
    const studentName = sessionStorage.getItem('studentName') || "Student"; 
    // Greeting based on time
    let greeting;
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";
    
    // Update welcome message
    welcomeEl.textContent = `${greeting}, ${studentName}`;
    
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

// Redirect Functions
function redirectToAssignments() {
    window.location.href = "index.html";
}

function redirectToGrades() {
    window.location.href = "grade.html";
}

function redirectToContact() {
    window.location.href = "contact_teacher.html";
}

function redirectToResources() {
    window.location.href = "resource.html";
}

// Logout Function
function signOut() {
    // Here you would typically clear session/local storage
    alert("You have been signed out successfully!");
    window.location.href = "studentlogin.html";
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Update welcome message on page load
    updateWelcomeMessage();
    
    // Home Button
    document.getElementById('homeBtn').addEventListener('click', () => {
        // Reload current page or do nothing since we're already on home
        window.location.reload();
    });
    
    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', signOut);
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});