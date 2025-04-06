// Sample resources data
const resourcesData = {
    mathematics: [
        { name: 'Algebra Textbook', link: '#', type: 'pdf' },
        { name: 'Calculus Lecture Notes', link: '#', type: 'pdf' },
        { name: 'Geometry Problem Set', link: '#', type: 'pdf' }
    ],
    science: [
        { name: 'Biology Research Paper', link: '#', type: 'pdf' },
        { name: 'Chemistry Lab Manual', link: '#', type: 'pdf' },
        { name: 'Physics Formulas Guide', link: '#', type: 'pdf' }
    ],
    literature: [
        { name: 'Classic Novels Collection', link: '#', type: 'pdf' },
        { name: 'Poetry Anthology', link: '#', type: 'pdf' },
        { name: 'Writing Skills Workbook', link: '#', type: 'pdf' }
    ],
    'computer-science': [
        { name: 'Python Programming Guide', link: '#', type: 'pdf' },
        { name: 'Web Development Handbook', link: '#', type: 'pdf' },
        { name: 'Algorithms and Data Structures', link: '#', type: 'pdf' }
    ]
};

// Function to populate resources
function populateResources() {
    Object.keys(resourcesData).forEach(category => {
        const listElement = document.getElementById(`${category}Resources`);
        resourcesData[category].forEach(resource => {
            const listItem = document.createElement('li');
            
            // Create resource link
            const resourceLink = document.createElement('a');
            resourceLink.href = resource.link;
            resourceLink.textContent = resource.name;
            resourceLink.target = '_blank';
            
            // Create download icon
            const downloadIcon = document.createElement('i');
            downloadIcon.classList.add('fas', 'fa-download', 'download-icon');
            
            listItem.appendChild(resourceLink);
            listItem.appendChild(downloadIcon);
            
            listElement.appendChild(listItem);
        });
    });
}

// Logout Function
function signOut() {
    alert("You have been signed out successfully!");
    window.location.href = "login.html";
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Populate resources on page load
    populateResources();

    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', signOut);
});