document.addEventListener("DOMContentLoaded", function () {
    let studentID = localStorage.getItem("studentId");

    if (!studentID) {
        document.getElementById("studentIdPopup").classList.add("show-popup");
    } else {
        loadStudentDetails(studentID);
    }
});

// Function to Submit Student ID
function submitStudentId() {
    let studentID = document.getElementById("studentIdInput").value.trim();

    if (studentID) {
        localStorage.setItem("studentId", studentID);
        document.getElementById("studentIdPopup").classList.remove("show-popup");

        // Clear old details before loading new data
        document.getElementById("studentID").innerText = "";
        document.getElementById("studentName").innerText = "";
        document.getElementById("studentClass").innerText = "";
        document.getElementById("studentDepartment").innerText = "";
        document.getElementById("genderEmoji").innerText = "";
        document.getElementById("feesRecord").innerText = "";
        document.getElementById("pendingFees").innerText = "";
        document.getElementById("attendanceRecord").innerText = "";
        document.getElementById("marksRecord").innerText = "";

        loadStudentDetails(studentID);
    } else {
        alert("Please enter a valid Student ID.");
    }
}


// Function to fetch student details from IndexedDB
function loadStudentDetails(studentID) {
    let dbRequest = indexedDB.open("AdvityaDB", 1);

    dbRequest.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction("students", "readonly");
        let store = transaction.objectStore("students");

        let request = store.get(studentID);

        request.onsuccess = function () {
            let student = request.result;

            if (student) {
                console.log("Student Data Found:", student);

                document.getElementById("studentID").innerText = student.ID;
                document.getElementById("studentName").innerText = student.Name;
                document.getElementById("studentClass").innerText = student.Class;
                document.getElementById("studentDepartment").innerText = student.Department;
                document.getElementById("genderEmoji").innerText = student.Gender === "Male" ? "👦" : "👧";
                document.getElementById("feesRecord").innerText = student.fee ? `₹${student.fee}` : "No fees assigned";
                document.getElementById("pendingFees").innerText = student.fee && student.fee !== "Paid" ? `₹${student.fee}` : "No pending fees";
                document.getElementById("attendanceRecord").innerText = student.attendance || "No record";
                document.getElementById("marksRecord").innerText = `Total: ${student.total} | Percentage: ${student.percentage}%`;
            } else {
                alert("No student data found for this ID.");
                localStorage.removeItem("studentId");
                window.location.reload();
            }
        };

        request.onerror = function () {
            console.error("Error retrieving student data from IndexedDB.");
        };
    };

    dbRequest.onerror = function () {
        console.error("Error opening IndexedDB.");
    };
}

// Function to open and switch between tabs
function openTab(tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.getElementById(tabName).classList.add("active");

    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add("active");
}
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener("change", function () {
            document.getElementById("upiSection").style.display = this.value === "upi" ? "block" : "none";
            document.getElementById("cardSection").style.display = this.value === "card" ? "block" : "none";
        });
    });


// Payment Simulation Function
function makeFakePayment() {
    let studentID = localStorage.getItem("studentId");

    if (!studentID) {
        console.error("No student ID found in localStorage.");
        return;
    }

    let dbRequest = indexedDB.open("AdvityaDB", 1);

    dbRequest.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction("students", "readwrite");
        let store = transaction.objectStore("students");
        let request = store.get(studentID);

        request.onsuccess = function () {
            let student = request.result;

            if (student) {
                student.fee = "Paid"; // Update fee status
                let updateRequest = store.put(student);

                updateRequest.onsuccess = function () {
                    console.log("Payment status updated successfully in IndexedDB.");
                    document.getElementById("pendingFees").innerText = "No pending fees";
                };

                updateRequest.onerror = function () {
                    console.error("Error updating payment status.");
                };
            } else {
                console.error("Student record not found.");
            }
        };

        request.onerror = function () {
            console.error("Error retrieving student data.");
        };
    };

    dbRequest.onerror = function () {
        console.error("Error opening IndexedDB.");
    };

    // Show payment notification
    let notification = document.getElementById("paymentNotification");
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 3000);
}

// Logout Function
function logout() {
    localStorage.removeItem("studentId"); // Clear Student ID on logout
    window.location.href = "index.html"; // Redirect to login page
}


// Expose functions to global scope
window.openTab = openTab;
window.makeFakePayment = makeFakePayment;
window.logout = logout;
