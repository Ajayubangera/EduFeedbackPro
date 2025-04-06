// Dummy data for courses and grades
const courseData = [
    { name: 'Mathematics', grade: 'A', credits: 4, performance: 'Excellent' },
    { name: 'Computer Science', grade: 'A-', credits: 3, performance: 'Very Good' },
    { name: 'Physics', grade: 'B+', credits: 4, performance: 'Good' },
    { name: 'English Literature', grade: 'A', credits: 3, performance: 'Excellent' },
    { name: 'Chemistry', grade: 'B', credits: 4, performance: 'Satisfactory' }
];

const semesterData = [
    { 
        semester: 'Fall 2023', 
        gpa: 3.75, 
        credits: 15, 
        courses: 5 
    },
    { 
        semester: 'Spring 2024', 
        gpa: 3.85, 
        credits: 15, 
        courses: 5 
    }
];

// Function to populate grades table
function populateGradesTable() {
    const tableBody = document.getElementById('gradesTableBody');
    courseData.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.grade}</td>
            <td>${course.credits}</td>
            <td>${course.performance}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to populate semester breakdown
function populateSemesterBreakdown() {
    const semesterBreakdown = document.getElementById('semesterBreakdown');
    semesterData.forEach(semester => {
        const semesterCard = document.createElement('div');
        semesterCard.classList.add('semester-card');
        semesterCard.innerHTML = `
            <h3>${semester.semester}</h3>
            <div class="semester-details">
                <p>GPA: ${semester.gpa}</p>
                <p>Credits: ${semester.credits}</p>
                <p>Courses: ${semester.courses}</p>
            </div>
        `;
        semesterBreakdown.appendChild(semesterCard);
    });
}

// Function to create performance trend chart
function createPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'],
            datasets: [{
                label: 'GPA Trend',
                data: [3.5, 3.65, 3.75, 3.85],
                borderColor: '#4ecca3',
                backgroundColor: 'rgba(78, 204, 163, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    max: 4.0,
                    ticks: {
                        color: '#e0e0e0'
                    }
                },
                x: {
                    ticks: {
                        color: '#e0e0e0'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            }
        }
    });
}

// Logout Function
function signOut() {
    alert("You have been signed out successfully!");
    window.location.href = "login.html";
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Populate grades table
    populateGradesTable();
    
    // Populate semester breakdown
    populateSemesterBreakdown();
    
    // Create performance chart
    createPerformanceChart();
    
    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', signOut);
});