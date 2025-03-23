document.addEventListener("DOMContentLoaded", function () {
    let userRole = localStorage.getItem("userRole");
    if (userRole !== "student") {
        alert("Unauthorized access!");
        window.location.href = "index.html";
    }
});

function fetchStudentDetails() {
    let studentId = document.getElementById("studentIdInput").value.trim();
    if (!studentId) {
        alert("Please enter a valid Student ID!");
        return;
    }

    fetch(`http://localhost/college_management/fetch_student.php?student_id=${studentId}`)
    .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById("studentName").innerText = data.name;
                document.getElementById("studentId").innerText = data.student_id;
                document.getElementById("admissionNo").innerText = data.admission_no;
                document.getElementById("rollNo").innerText = data.roll_no;
                document.getElementById("classSection").innerText = data.class_section;
                document.getElementById("gender").innerText = data.gender;
                document.getElementById("fatherName").innerText = data.father_name;
                document.getElementById("feeStatus").innerText = data.fee_status;

                // Hide the modal & show student details
                document.getElementById("studentIdModal").style.display = "none";
                document.getElementById("student-info-card").style.display = "block";
            }
        })
        .catch(error => console.error("Error fetching student details:", error));
}

document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("userRole");
    window.location.href = "index.html";
});
