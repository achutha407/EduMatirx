// Open Modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Show Notification
function showNotification(message, success = true) {
    let notification = document.getElementById("notification");
    notification.innerText = message;
    notification.style.backgroundColor = success ? "blue" : "red";
    notification.style.display = "block";
    setTimeout(() => { notification.style.display = "none"; }, 3000);
}

document.getElementById("userType").addEventListener("change", function () {
    let userType = this.value;

    document.getElementById("id").placeholder = userType === "faculty" ? "Faculty ID" : "Student ID";
    document.getElementById("name").placeholder = userType === "faculty" ? "Faculty Name" : "Student Name";
    document.getElementById("dob").placeholder = "Date of Birth"; // Same for both
    document.getElementById("department").placeholder = userType === "faculty" ? "Faculty Department" : "Student Department";
    document.getElementById("email").placeholder = userType === "faculty" ? "Faculty Email" : "Student Email";
    document.getElementById("password").placeholder = userType === "faculty" ? "Faculty Password" : "Student Password";

    // Handle class field visibility
    let classField = document.getElementById("class");
    if (userType === "faculty") {
        classField.style.display = "none";
        classField.value = ""; // Clear value if hidden
    } else {
        classField.style.display = "block";
        classField.placeholder = "Class ";
    }
});

// Admin Login
function adminLogin() {
    let email = document.getElementById("adminEmail").value;
    let password = document.getElementById("adminPassword").value;
    if (email === "admin@advitya.in" && password === "407407") {
        closeModal('adminModal');
        openModal('idCreationModal');
        showNotification("Admin Login Successful!", true);
    } else {
        showNotification("Invalid Admin Credentials!", false);
    }
}

// Open IndexedDB
let db;
let request = indexedDB.open("AdvityaDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("students")) {
        db.createObjectStore("students", { keyPath: "ID" });
    }
    if (!db.objectStoreNames.contains("faculty")) {
        db.createObjectStore("faculty", { keyPath: "ID" });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("IndexedDB initialized successfully!");
};

function createID() {
    let userType = document.getElementById("userType").value;
    let id = document.getElementById("id").value;
    let name = document.getElementById("name").value;
    let dob = document.getElementById("dob").value;
    let gender = document.querySelector('input[name="gender"]:checked')?.value || "";
    let department = document.getElementById("department").value;
    let userClass = document.getElementById("class").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (!id || !name || !dob || !gender || !department || !email || !password) {
        showNotification("All fields are required!", false);
        return;
    }

    if (!db) {
        showNotification("Database not initialized yet. Try again!", false);
        return;
    }

    let userData = {
        ID: id,
        Name: name,
        DOB: dob,
        Gender: gender,
        Department: department,
        Class: userType === "student" ? userClass : "N/A",
        Email: email,
        Password: password
    };

    let transaction = db.transaction(userType === "student" ? "students" : "faculty", "readwrite");
    let store = transaction.objectStore(userType === "student" ? "students" : "faculty");

    let addRequest = store.add(userData);
    addRequest.onsuccess = function () {
        closeModal('idCreationModal');
        showNotification(`${userType.charAt(0).toUpperCase() + userType.slice(1)} ID Created Successfully!`, true);
    };
    addRequest.onerror = function () {
        showNotification("Error creating ID. Try again!", false);
    };
}

document.addEventListener("DOMContentLoaded", function () {
    let userTypeDropdown = document.getElementById("userType");

    if (userTypeDropdown) {
        userTypeDropdown.addEventListener("change", function () {
            let userType = this.value;

            let idField = document.getElementById("id");
            let nameField = document.getElementById("name");
            let dobField = document.getElementById("dob");
            let departmentField = document.getElementById("department");
            let emailField = document.getElementById("email");
            let passwordField = document.getElementById("password");
            let classField = document.getElementById("class");

            if (idField && nameField && dobField && departmentField && emailField && passwordField) {
                idField.placeholder = userType === "faculty" ? "Faculty ID" : "Student ID";
                nameField.placeholder = userType === "faculty" ? "Faculty Name" : "Student Name";
                dobField.placeholder = "Date of Birth";
                departmentField.placeholder = userType === "faculty" ? "Faculty Department" : "Student Department";
                emailField.placeholder = userType === "faculty" ? "Faculty Email" : "Student Email";
                passwordField.placeholder = userType === "faculty" ? "Faculty Password" : "Student Password";
            }

            // Handle class field visibility
            if (classField) {
                if (userType === "faculty") {
                    classField.style.display = "none";
                    classField.value = "";
                } else {
                    classField.style.display = "block";
                    classField.placeholder = "Class";
                }
            }
        });
    }
});

// Login on Enter Key Press
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".modal-content input").forEach(input => {
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                let form = this.closest(".modal-content");
                let button = form.querySelector("button");
                button.click();
            }
        });
    });
});

// Student Login Logic
function studentLogin() {
    let studentId = document.getElementById("studentId").value;
    let email = document.getElementById("studentEmail").value;
    let password = document.getElementById("studentPassword").value;

    let transaction = db.transaction("students", "readonly");
    let store = transaction.objectStore("students");
    let request = store.get(studentId);

    request.onsuccess = function () {
        let student = request.result;
        if (student && student.Email === email && student.Password === password) {
            showNotification("Student Login Successful!", true);
            setTimeout(() => {
                window.location.href = "student.html";  // Redirect to Student Dashboard
            }, 1000);
        } else {
            showNotification("Invalid Student Credentials!", false);
        }
    };

    request.onerror = function () {
        showNotification("Error accessing database!", false);
    };
}

// Faculty Login Logic
function facultyLogin() {
    let facultyId = document.getElementById("facultyId").value;
    let email = document.getElementById("facultyEmail").value;
    let password = document.getElementById("facultyPassword").value;

    let transaction = db.transaction("faculty", "readonly");
    let store = transaction.objectStore("faculty");
    let request = store.get(facultyId);

    request.onsuccess = function () {
        let faculty = request.result;
        if (faculty && faculty.Email === email && faculty.Password === password) {
            showNotification("Faculty Login Successful!", true);
            setTimeout(() => {
                window.location.href = "faculty.html";  // Redirect to Faculty Dashboard
            }, 1000);
        } else {
            showNotification("Invalid Faculty Credentials!", false);
        }
    };

    request.onerror = function () {
        showNotification("Error accessing database!", false);
    };
}
