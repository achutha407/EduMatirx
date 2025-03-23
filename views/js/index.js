
// Show login modal & hide buttons
// Show login modal
function showLogin() {
    document.getElementById("loginModal").style.display = "block";
}

// Close login modal
function closeModal() {
    document.getElementById("loginModal").style.display = "none";
}

// Update email input placeholder based on role selection
function updateEmailPlaceholder() {
    let role = document.getElementById("role").value;
    let emailInput = document.getElementById("emailInput");

    if (role === "student") {
        emailInput.placeholder = "Enter Student Email";
    } else {
        emailInput.placeholder = "Enter Faculty Email";
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    let loginModal = document.getElementById("loginModal");
    let signupModal = document.getElementById("signupModal");
    let newUserModal = document.getElementById("newUserModal");

    if (event.target == loginModal) closeModal();
    if (event.target == signupModal) closeSignupModal();
    if (event.target == newUserModal) closeNewUserModal();
};

// Show Signup Modal
function showSignUp() {
    document.getElementById("signupModal").style.display = "block";
    document.querySelector(".auth-buttons").classList.add("hidden");
}

// Close Signup Modal
function closeSignupModal() {
    document.getElementById("signupModal").style.display = "none";
    document.querySelector(".auth-buttons").classList.remove("hidden");
}

// Show New User Registration Modal (Only after Admin login)
function showNewUserModal() {
    document.getElementById("newUserModal").style.display = "block";
}

// Close New User Registration Modal
function closeNewUserModal() {
    document.getElementById("newUserModal").style.display = "none";
}

// Register New User & Save in Local Storage
async function registerUser() {
    const email = document.getElementById("newUserEmail").value;
    const password = document.getElementById("newUserPassword").value;
    const role = document.getElementById("newUserRole").value;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    const response = await fetch("http://localhost/college_management/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }, body: new URLSearchParams({
            email: email,
            password: password,
            role: role
        })
    });
    const result = await response.json();

    if (result.status === "success") {
        alert("User registered successfully!");
        document.getElementById("signupModal").style.display = "none";
    } 
}

// Login Function (Checks Local Storage)

const auth = window.auth;

// Login Function (Calls login.php)
async function login() {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const role = document.getElementById("role").value;

    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);

    try {
        console.log("Sending Login Request to login.php"); // Debugging
        const response = await fetch("http://localhost/college_management/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        const text = await response.text();
        console.log("Raw Response:", text); // Debugging

        try {
            const result = JSON.parse(text);
            console.log("Parsed JSON Response:", result);

            if (result.status === "success") {
                localStorage.setItem("userRole", result.role);
                window.location.href = result.role === "faculty" ? "faculty.html" : "student.html";
            } else {
                alert("Login Failed! " + result.message);
            }
        } catch (error) {
            console.error("JSON Parse Error:", error);
            alert("Error: Invalid JSON response from server.");
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network Error: " + error.message);
    }
}



// Function to show notification
function showNotification(message) {
    let container = document.getElementById("notification-container");
    let notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = message;
    
    container.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to clear input fields after closing popup
function clearFields() {
    document.querySelectorAll("input").forEach(input => input.value = "");
    document.getElementById("role").value = "student"; // Reset dropdown
}

// Verify admin credentials
function verifyAdmin() {
    let email = document.getElementById("adminEmail").value;
    let password = document.getElementById("adminPassword").value;

    if (email === "clgadmin@gmail.com" && password === "407407") {
        showNotification("Admin Verified");
        closeModal(); // Close login modal
        clearFields(); // Clear fields
        showNewUserModal(); // Open the "Create New User" modal
    } else {
        showNotification("Invalid Admin Credentials");
    }
}

// Register student
function registerStudent() {
    showNotification("Student Registered Successfully!");
    closeModal();
    clearFields();
}

// Register faculty
function registerFaculty() {
    showNotification("Faculty Registered Successfully!");
    closeModal();
    clearFields();
}

function toggleUserFields() {
    const role = document.getElementById("newUserRole").value;

    // Common Fields
    const emailField = document.getElementById("newUserEmail");
    const passwordField = document.getElementById("newUserPassword");

    // Student Fields
    const studentFields = document.getElementById("studentFields");
    const studentName = document.getElementById("studentName");
    const studentPhone = document.getElementById("studentPhone");
    const studentSemester = document.getElementById("studentSemester");
    const studentDepartment = document.getElementById("studentDepartment");

    // Faculty Fields
    const facultyFields = document.getElementById("facultyFields");
    const facultyName = document.getElementById("facultyName");
    const facultyPhone = document.getElementById("facultyPhone");
    const facultyDepartment = document.getElementById("facultyDepartment");
    const facultyDesignation = document.getElementById("facultyDesignation");

    if (role === "student") {
        studentFields.style.display = "block";
        facultyFields.style.display = "none";

        // Update placeholders
        emailField.placeholder = "Enter Student Email";
        passwordField.placeholder = "Enter Student Password";
        studentName.placeholder = "Enter Student Name";
        studentPhone.placeholder = "Enter Student Phone Number";
        studentSemester.placeholder = "Enter Student Semester";
        studentDepartment.placeholder = "Enter Student Department";
    } else {
        studentFields.style.display = "none";
        facultyFields.style.display = "block";

        // Update placeholders
        emailField.placeholder = "Enter Faculty Email";
        passwordField.placeholder = "Enter Faculty Password";
        facultyName.placeholder = "Enter Faculty Name";
        facultyPhone.placeholder = "Enter Faculty Phone Number";
        facultyDepartment.placeholder = "Enter Faculty Department";
        facultyDesignation.placeholder = "Enter Faculty Designation";
    }
}

window.showLogin = showLogin;
window.closeModal = closeModal;
window.showSignUp = showSignUp;
window.closeSignupModal = closeSignupModal;
window.login = login;
