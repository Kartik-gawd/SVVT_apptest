const COURSES = [
  { id: "CS101", name: "Introduction to Computer Science", credits: 4 },
  { id: "MA201", name: "Mathematics", credits: 4 },
  { id: "PH101", name: "Engineering Physics", credits: 3 },
  { id: "DB301", name: "Database Management Systems", credits: 4 },
  { id: "SE302", name: "Software Engineering", credits: 3 },
  { id: "CN303", name: "Computer Networks", credits: 3 }
];

const DEMO_STUDENT = {
  id: "demo-student",
  name: "Demo Student",
  email: "student@example.com",
  password: "Student@123",
  role: "student"
};

const ADMIN = {
  email: "admin@example.com",
  password: "Admin@123",
  role: "admin",
  name: "Administrator"
};

function getUsers() {
  const users = JSON.parse(localStorage.getItem("osrs_users") || "[]");
  if (!users.some(u => u.email === DEMO_STUDENT.email)) users.push(DEMO_STUDENT);
  return users;
}
function saveUsers(users) { localStorage.setItem("osrs_users", JSON.stringify(users)); }
function getRegistrations() { return JSON.parse(localStorage.getItem("osrs_registrations") || "[]"); }
function saveRegistrations(r) { localStorage.setItem("osrs_registrations", JSON.stringify(r)); }
function currentUser() { return JSON.parse(sessionStorage.getItem("osrs_session") || "null"); }

function toast(message, error = false) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.className = "toast show" + (error ? " error" : "");
  setTimeout(() => el.className = "toast", 2600);
}

function showPage(id, push = true) {
  const protectedPage = ["dashboardPage", "adminPage"].includes(id);
  const user = currentUser();

  if (protectedPage && !user) {
    id = "loginPage";
    toast("Please log in to access the protected page.", true);
  }
  if (id === "adminPage" && (!user || user.role !== "admin")) {
    id = "loginPage";
    toast("Administrator access required.", true);
  }

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(id) || document.getElementById("notFoundPage");
  page.classList.add("active");

  if (push) {
    history.pushState({ page: page.id }, "", "#" + page.id.replace("Page", "").toLowerCase());
  }

  updateNav();
  if (page.id === "dashboardPage") renderDashboard();
  if (page.id === "adminPage") renderAdmin();
}

function updateNav() {
  const nav = document.getElementById("nav");
  const user = currentUser();
  nav.innerHTML = "";
  if (!user) {
    nav.innerHTML = `<button onclick="showPage('homePage')">Home</button>
                     <button onclick="showPage('loginPage')">Login</button>
                     <button onclick="showPage('registerPage')">Register</button>`;
  } else if (user.role === "admin") {
    nav.innerHTML = `<button onclick="showPage('adminPage')">Approvals</button>
                     <button onclick="logout()">Logout</button>`;
  } else {
    nav.innerHTML = `<button onclick="showPage('dashboardPage')">Dashboard</button>
                     <button onclick="logout()">Logout</button>`;
  }
}

function login(email, password) {
  const normalized = email.trim().toLowerCase();

  if (normalized === ADMIN.email && password === ADMIN.password) {
    sessionStorage.setItem("osrs_session", JSON.stringify(ADMIN));
    toast("Login successful.");
    showPage("adminPage");
    return;
  }

  const user = getUsers().find(u => u.email.toLowerCase() === normalized && u.password === password);
  if (!user) {
    toast("Invalid username or password.", true);
    return;
  }

  sessionStorage.setItem("osrs_session", JSON.stringify(user));
  if (!sessionStorage.getItem("osrs_selected")) sessionStorage.setItem("osrs_selected", JSON.stringify([]));
  toast("Login successful.");
  showPage("dashboardPage");
}

document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  login(document.getElementById("loginUsername").value, document.getElementById("loginPassword").value);
});

document.getElementById("registerForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirmPassword").value;

  if (!name || !email || !password || !confirm) {
    toast("All fields are required.", true);
    return;
  }
  if (password !== confirm) {
    toast("Error: passwords do not match.", true);
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === email)) {
    toast("Error: e-mail already registered.", true);
    return;
  }

  const user = { id: "u-" + Date.now(), name, email, password, role: "student" };
  users.push(user);
  saveUsers(users);
  toast("Account created successfully.");
  document.getElementById("registerForm").reset();
  document.getElementById("loginUsername").value = email;
  showPage("loginPage");
});

document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  searchCourses();
});

function searchCourses() {
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
  const results = COURSES.filter(c =>
    c.name.toLowerCase().includes(keyword) || c.id.toLowerCase().includes(keyword)
  );
  const msg = document.getElementById("searchMessage");
  msg.textContent = results.length ? `${results.length} course(s) found.` : "No results found";
  document.getElementById("courseResults").innerHTML = results.map(c => `
    <div class="course ${isSelected(c.id) ? "selected" : ""}">
      <div><strong>${c.id} - ${c.name}</strong><small>${c.credits} credits</small></div>
      <button class="btn ${isSelected(c.id) ? "secondary" : "primary"}" onclick="toggleCourse('${c.id}')">
        ${isSelected(c.id) ? "Remove" : "Select"}
      </button>
    </div>
  `).join("");
}

function getSelected() { return JSON.parse(sessionStorage.getItem("osrs_selected") || "[]"); }
function setSelected(arr) { sessionStorage.setItem("osrs_selected", JSON.stringify(arr)); }
function isSelected(id) { return getSelected().includes(id); }

function toggleCourse(id) {
  const selected = getSelected();
  if (selected.includes(id)) setSelected(selected.filter(x => x !== id));
  else setSelected([...selected, id]);
  renderDashboard();
  const q = document.getElementById("searchInput").value;
  if (q) searchCourses();
}

function renderDashboard() {
  const user = currentUser();
  if (!user) return;
  document.getElementById("welcomeTitle").textContent = `Welcome, ${user.name}`;
  const selected = getSelected();
  document.getElementById("selectedCount").textContent = selected.length;

  const registration = getRegistrations().find(r => r.userId === user.id);
  document.getElementById("registrationStatus").textContent = registration ? registration.status : "Not Submitted";

  const selectedEl = document.getElementById("selectedCourses");
  if (!selected.length) {
    selectedEl.innerHTML = `<div class="empty">No courses selected yet. Search for a course and select it.</div>`;
  } else {
    selectedEl.innerHTML = selected.map(id => {
      const c = COURSES.find(x => x.id === id);
      return `<div class="selected-item"><span>${c.id} - ${c.name}</span><button class="btn danger" onclick="toggleCourse('${c.id}')">Remove</button></div>`;
    }).join("");
  }
  document.getElementById("submitRegistration").disabled = selected.length === 0;
}

function submitRegistration() {
  const user = currentUser();
  const selected = getSelected();
  if (!user || !selected.length) {
    toast("Select at least one course before submitting.", true);
    return;
  }

  const registrations = getRegistrations();
  const existing = registrations.find(r => r.userId === user.id);
  if (existing) {
    existing.courseIds = selected;
    existing.status = "Pending";
    existing.updatedAt = new Date().toISOString();
  } else {
    registrations.push({
      id: "reg-" + Date.now(),
      userId: user.id,
      studentName: user.name,
      email: user.email,
      courseIds: selected,
      status: "Pending",
      createdAt: new Date().toISOString()
    });
  }
  saveRegistrations(registrations);
  toast("Registration submitted successfully.");
  renderDashboard();
}

function renderAdmin() {
  const registrations = getRegistrations();
  const el = document.getElementById("adminRegistrations");
  if (!registrations.length) {
    el.innerHTML = `<div class="empty">No registration requests are currently available.</div>`;
    return;
  }

  el.innerHTML = `
    <div class="admin-row">
      <strong>Student</strong><strong>Courses</strong><strong>Status</strong><strong>Submitted</strong><strong>Action</strong>
    </div>
    ${registrations.map(r => `
      <div class="admin-row">
        <div><strong>${r.studentName}</strong><br><small>${r.email}</small></div>
        <div>${r.courseIds.map(id => COURSES.find(c => c.id === id)?.name || id).join(", ")}</div>
        <div><span class="status ${r.status.toLowerCase()}">${r.status}</span></div>
        <div>${new Date(r.createdAt).toLocaleDateString()}</div>
        <div class="admin-actions">
          <button class="btn primary" onclick="setRegistrationStatus('${r.id}', 'Approved')">Approve</button>
          <button class="btn danger" onclick="setRegistrationStatus('${r.id}', 'Rejected')">Reject</button>
        </div>
      </div>
    `).join("")}
  `;
}

function setRegistrationStatus(id, status) {
  const registrations = getRegistrations();
  const r = registrations.find(x => x.id === id);
  if (r) {
    r.status = status;
    saveRegistrations(registrations);
    toast(`Registration ${status.toLowerCase()}.`);
    renderAdmin();
  }
}

function logout() {
  sessionStorage.removeItem("osrs_session");
  sessionStorage.removeItem("osrs_selected");
  history.replaceState({ page: "homePage" }, "", location.pathname);
  showPage("homePage", false);
  toast("Logged out successfully.");
}

// Prevent browser Back from exposing a protected dashboard after logout.
window.addEventListener("popstate", () => {
  const user = currentUser();
  const hash = location.hash.replace("#", "");
  const map = {
    "": "homePage", home: "homePage", login: "loginPage", register: "registerPage",
    dashboard: "dashboardPage", admin: "adminPage"
  };
  let target = map[hash] || "notFoundPage";
  if ((target === "dashboardPage" || target === "adminPage") && !user) target = "loginPage";
  if (target === "adminPage" && user?.role !== "admin") target = "loginPage";
  showPage(target, false);
});

// Handle direct URL / refresh.
window.addEventListener("DOMContentLoaded", () => {
  updateNav();
  const hash = location.hash.replace("#", "");
  const map = { "": "homePage", home: "homePage", login: "loginPage", register: "registerPage", dashboard: "dashboardPage", admin: "adminPage" };
  showPage(map[hash] || "homePage", false);
});

// Expose useful functions for Selenium/manual testing.
window.OSRS = { login, logout, showPage, searchCourses, submitRegistration, getUsers, getRegistrations, COURSES };
