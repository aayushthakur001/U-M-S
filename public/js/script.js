// Show preloader for 3 seconds
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("preloader").style.display = "none";
  }, 2000);
  // Removed dark mode theme application
});

// Enable smooth scrolling for the entire page
document.documentElement.style.scrollBehavior = "smooth";

// Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");
if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
    darkModeToggle.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"; // Update button text
  });

  // Apply dark mode based on saved preference
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️ Light Mode"; // Set initial button text
  }
}

async function loadStudents() {
  const res = await fetch('/api/students');
  const data = await res.json();
  const list = document.getElementById('studentList');
  list.innerHTML = '';
  data.forEach(student => {
    const li = document.createElement('li');
    li.innerHTML = `${student.name} (Grade: ${student.grade})
      <button onclick="editStudent(${student.id}, '${student.name}', '${student.grade}')">Edit</button>
      <button onclick="deleteStudent(${student.id})">Delete</button>`;
    list.appendChild(li);
  });
}

document.getElementById('studentForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('studentName').value;
  const grade = document.getElementById('studentGrade').value;
  await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, grade })
  });
  e.target.reset();
  loadStudents();
});

// Contact form submission
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const message = document.getElementById("contactMessage").value;
  alert(`Thank you, ${name}! Your message has been sent.`);
  e.target.reset();
});

async function deleteStudent(id) {
  await fetch(`/api/students/${id}`, { method: 'DELETE' });
  loadStudents();
}

async function editStudent(id, currentName, currentGrade) {
  const name = prompt('Edit name:', currentName);
  const grade = prompt('Edit grade:', currentGrade);
  if (name && grade) {
    await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, grade })
    });
    loadStudents();
  }
}

loadStudents();
