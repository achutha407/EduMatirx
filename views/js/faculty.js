console.log("✅ faculty.js is loaded!");

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM is fully loaded!");

    // Check if the user is a faculty member
    let userRole = localStorage.getItem("userRole");
    console.log("User Role:", userRole);

    if (userRole !== "faculty") {
        alert("Unauthorized access!");
        window.location.href = "index.html";
    }else {
        // Open the dashboard section by default
        showSection("student-data");  // Replace "student-data" with your dashboard section ID
    }

    // Check if buttons exist before attaching event listeners
    function checkButton(id) {
        const btn = document.getElementById(id);
        if (btn) {
            console.log(`✅ Button found: #${id}`);
            return btn;
        } else {
            console.error(`❌ ERROR: Button not found: #${id}`);
            return null;
        }
    }

    // Attach event listeners with error handling
    function addClickListener(id, callback) {
        const btn = checkButton(id);
        if (btn) {
            btn.addEventListener("click", callback);
        }
    }

    // Sidebar Navigation
    addClickListener("dashboard", () => showSection("student-data"));
    addClickListener("create-student", () => showSection("student-form"));
    addClickListener("mark-attendance", () => showSection("attendance-section"));
    addClickListener("add-marks", () => showSection("marks-section"));
    addClickListener("assign-fees", () => showSection("fees-section"));
    addClickListener("logout", () => {
        localStorage.removeItem("userRole");
        window.location.href = "index.html";
    });

    // Show and Hide Sections
    function showSection(sectionId) {
        document.querySelectorAll(".main-content > div").forEach(div => div.style.display = "none");
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = "block";
        } else {
            console.error(`❌ ERROR: Section not found: #${sectionId}`);
        }
    }
    async function loadStudentsForMarks() {
        try {
            const response = await fetch("http://localhost/college_management/students.php");
            const students = await response.json();
            const marksTableBody = document.querySelector("#marks-table tbody");
    
            marksTableBody.innerHTML = ""; // Clear table
    
            students.forEach(student => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.student_id}</td>
                    <td>${student.name}</td>
                    <td><input type="number" class="marks-input" data-subject="physics" data-id="${student.student_id}" min="0" max="100"></td>
                    <td><input type="number" class="marks-input" data-subject="chemistry" data-id="${student.student_id}" min="0" max="100"></td>
                    <td><input type="number" class="marks-input" data-subject="maths" data-id="${student.student_id}" min="0" max="100"></td>
                    <td><input type="number" class="marks-input" data-subject="biology" data-id="${student.student_id}" min="0" max="100"></td>
                    <td class="total-marks">0</td>
                    <td><button class="save-mark-btn" data-id="${student.student_id}">✔ Save</button></td>
                `;
    
                marksTableBody.appendChild(row);
            });
    
            // Auto-calculate total when marks are entered
            document.querySelectorAll(".marks-input").forEach(input => {
                input.addEventListener("input", function () {
                    const row = this.closest("tr");
                    const inputs = row.querySelectorAll(".marks-input");
                    let total = 0;
    
                    inputs.forEach(inp => {
                        total += parseInt(inp.value) || 0;
                    });
    
                    row.querySelector(".total-marks").innerText = total;
                });
            });
    
            // Add event listener to save marks button
            document.querySelectorAll(".save-mark-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const studentId = this.getAttribute("data-id");
                    saveMarks(studentId);
                });
            });
    
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }
    function saveMarks(studentId) {
        const physics = parseInt(document.getElementById(`physics-${studentId}`).value) || 0;
        const chemistry = parseInt(document.getElementById(`chemistry-${studentId}`).value) || 0;
        const maths = parseInt(document.getElementById(`maths-${studentId}`).value) || 0;
        const biology = parseInt(document.getElementById(`biology-${studentId}`).value) || 0;
    
        const total = physics + chemistry + maths + biology;
    
        let studentMarks = JSON.parse(localStorage.getItem("studentMarks")) || {};
        studentMarks[studentId] = { physics, chemistry, maths, biology, total };
        localStorage.setItem("studentMarks", JSON.stringify(studentMarks));
    
        document.getElementById(`total-${studentId}`).innerText = total;
        alert("Marks saved successfully!");
    }
    
    
    // Load student data when "Add Marks" section is opened
    document.getElementById("add-marks").addEventListener("click", () => {
        showSection("marks-section");
        loadStudentsForMarks();
    });
    
    // Fetch Students from Database
    async function loadStudents() {
        try {
            const response = await fetch("http://localhost/college_management/students.php");
            const students = await response.json();
            const studentList = document.getElementById("students-list");
            const attendanceList = document.getElementById("attendance-list");  // Assuming there's an attendance list container
    
            studentList.innerHTML = ""; // Clear existing list
            attendanceList.innerHTML = ""; // Clear existing attendance list
    
            students.forEach(student => {
                // Create student card
                const studentDiv = document.createElement("div");
                studentDiv.classList.add("student-card");
    
                // Gender emoji handling
                const genderEmoji = student.gender === "Male" ? "👦" : "👧";
    
                studentDiv.innerHTML = `
                    <h3>${student.name} ${genderEmoji}</h3>
                    <p>Student ID: ${student.student_id}</p>
                    <p>Admission No: ${student.admission_no}</p>
                    <p>Roll No: ${student.roll_no}</p>
                    <p>Class & Section: ${student.class_section}</p>
                    <p>Father's Name: ${student.father_name}</p>
                    <p>Fee Status: ${student.fee_status}</p>
                    <button class="delete-btn" data-id="${student.student_id}">Delete</button>
                `;
                
                studentList.appendChild(studentDiv);
    
                // Create attendance buttons for each student
                const attendanceDiv = document.createElement("div");
                attendanceDiv.classList.add("attendance-item");
                attendanceDiv.setAttribute("data-student-id", student.student_id);
    
                attendanceDiv.innerHTML = `
                    <p>${student.name}</p>
                    <button class="present-btn">Present</button>
                    <button class="absent-btn">Absent</button>
                `;
                
                attendanceList.appendChild(attendanceDiv);
            });
    
            // Delete Button Event Listener
            const deleteButtons = document.querySelectorAll(".delete-btn");
            deleteButtons.forEach(button => {
                button.addEventListener("click", function () {
                    const studentId = button.getAttribute("data-id");
                    deleteStudent(studentId); // Call the deleteStudent function
                });
            });
    
            // Attendance Button Event Listeners
            document.querySelectorAll(".present-btn").forEach(button => {
                button.addEventListener("click", function () {
                    this.classList.add("selected");
                    this.nextElementSibling.classList.remove("selected"); // Unselect Absent
                });
            });
    
            document.querySelectorAll(".absent-btn").forEach(button => {
                button.addEventListener("click", function () {
                    this.classList.add("selected");
                    this.previousElementSibling.classList.remove("selected"); // Unselect Present
                });
            });
    
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }
    
    loadStudents();
    
    // Save Attendance
document.getElementById("save-attendance").addEventListener("click", () => {
    const attendanceRecords = {};
    document.querySelectorAll(".attendance-item").forEach(item => {
        const studentId = item.getAttribute("data-student-id");
        const present = item.querySelector(".present-btn").classList.contains("selected");
        attendanceRecords[studentId] = present ? "Present" : "Absent";
    });

    // Save attendance to localStorage or send to server
    localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
    alert("Attendance saved successfully!");
});
// Reset Attendance Selection
document.getElementById("reset-attendance").addEventListener("click", () => {
    document.querySelectorAll(".attendance-item").forEach(item => {
        item.querySelector(".present-btn").classList.remove("selected");
        item.querySelector(".absent-btn").classList.remove("selected");
    });
    alert("Attendance reset successfully!");
});

    // Delete student record function
    async function deleteStudent(studentId) {
        try {
            const response = await fetch(`http://localhost/college_management/delete_student.php?id=${studentId}`);
            const data = await response.json();  // This will throw an error if the response isn't valid JSON
            if (data.success) {
                alert("Student deleted successfully!");
                loadStudents(); // Reload the student list after deletion
            } else {
                alert(`Error deleting student: ${data.message}`);
            }
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("An error occurred while deleting the student.");
        }
    }
    
    loadStudents(); // Call this function to initially load the students
    

    // Create Student
    document.getElementById("create-student-btn").addEventListener("click", async function () {
        const name = document.getElementById("student-name").value.trim();
        const studentId = document.getElementById("student-id").value.trim();
        const admissionNo = document.getElementById("admission-no").value.trim();
        const rollNo = document.getElementById("roll-no").value.trim();
        const classSection = document.getElementById("class-section").value.trim();
        const gender = document.getElementById("gender").value;
        const fatherName = document.getElementById("father-name").value.trim();
        const feeStatus = document.getElementById("fee-status").value;

        if (!name || !studentId || !admissionNo || !rollNo || !classSection || !fatherName) {
            alert("Please enter all student details!");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("student_id", studentId);
        formData.append("admission_no", admissionNo);
        formData.append("roll_no", rollNo);
        formData.append("class_section", classSection);
        formData.append("gender", gender);
        formData.append("father_name", fatherName);
        formData.append("fee_status", feeStatus);

        try {
            const response = await fetch("http://localhost/college_management/students.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            alert(result.message);
            loadStudents(); // Refresh student list
        } catch (error) {
            console.error("Error adding student:", error);
        }
    });

    // Assign Fees
    document.getElementById("assign-fees").addEventListener("click", function () {
        document.getElementById("fees-section").style.display = "block";
        renderStudentFees();
    });

    function renderStudentFees() {
        const feesList = document.getElementById("fees-list");
        feesList.innerHTML = ''; // Clear previous entries
        const students = JSON.parse(localStorage.getItem("students")) || [];

        students.forEach((student, index) => {
            const studentDiv = document.createElement("div");
            studentDiv.classList.add("student-card");
            studentDiv.innerHTML = `
                <h3>${student.name}</h3>
                <p>Student ID: ${student.studentId}</p>
                <div>
                    <label for="fee-${index}">Enter Fee:</label>
                    <input type="number" id="fee-${index}" placeholder="Fee Amount" min="0">
                </div>
                <button class="assign-fee-btn" data-index="${index}">Assign Fee</button>
            `;
            feesList.appendChild(studentDiv);
        });

        // Handle Assign Fee Click
        feesList.addEventListener("click", (e) => {
            if (e.target.classList.contains("assign-fee-btn")) {
                const index = e.target.getAttribute("data-index");
                const feeAmount = document.getElementById(`fee-${index}`).value;
                const students = JSON.parse(localStorage.getItem("students")) || [];
                students[index].fee = feeAmount;
                localStorage.setItem("students", JSON.stringify(students));
                alert("Fee Assigned Successfully");
            }
        });
    }

    // Mark Attendance
    document.getElementById("save-attendance").addEventListener("click", () => {
        const attendanceRecords = {};
        document.querySelectorAll(".attendance-item").forEach(item => {
            const studentId = item.getAttribute("data-student-id");
            const present = item.querySelector(".present-btn").classList.contains("selected");
            attendanceRecords[studentId] = present ? "Present" : "Absent";
        });

        localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
        alert("Attendance saved successfully!");
    });

    
    document.addEventListener("DOMContentLoaded", function () {
        const addMarksBtn = document.getElementById("add-marks");
        const marksSection = document.getElementById("marks-section");
    
        // Show Marks Section
        addMarksBtn.addEventListener("click", function () {
            showSection("marks-section");
            fetchMarks(); // Load student marks from database
        });
    
        // Function to Show a Section
        function showSection(sectionId) {
            document.querySelectorAll(".section").forEach(section => {
                section.style.display = "none";
            });
            document.getElementById(sectionId).style.display = "block";
        }
    
        // Fetch Student Marks from Database
        function fetchMarks() {
            fetch("get_marks.php") // Fetch from backend
                .then(response => response.json())
                .then(data => {
                    const tbody = document.querySelector("#marks-table tbody");
                    tbody.innerHTML = "";
    
                    data.forEach(student => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${student.student_id}</td>
                            <td><input type="number" value="${student.physics}" min="0" max="100" id="physics-${student.student_id}"></td>
                            <td><input type="number" value="${student.chemistry}" min="0" max="100" id="chemistry-${student.student_id}"></td>
                            <td><input type="number" value="${student.maths}" min="0" max="100" id="maths-${student.student_id}"></td>
                            <td><input type="number" value="${student.biology}" min="0" max="100" id="biology-${student.student_id}"></td>
                            <td id="total-${student.student_id}">${student.total}</td>
                            <td><button onclick="updateMarks('${student.student_id}')">Update</button></td>
                        `;
                        tbody.appendChild(row);
                    });
                })
                .catch(error => console.error("Error fetching marks:", error));
        }
    
        // Update Student Marks in Database
        function updateMarks(student_id) {
            const physics = parseInt(document.getElementById(`physics-${student_id}`).value) || 0;
            const chemistry = parseInt(document.getElementById(`chemistry-${student_id}`).value) || 0;
            const maths = parseInt(document.getElementById(`maths-${student_id}`).value) || 0;
            const biology = parseInt(document.getElementById(`biology-${student_id}`).value) || 0;
        
            const total = physics + chemistry + maths + biology;
        
            // Fetch existing marks from local storage
            let studentMarks = JSON.parse(localStorage.getItem("studentMarks")) || {};
            
            // Update marks for this student
            studentMarks[student_id] = { physics, chemistry, maths, biology, total };
            
            // Save back to local storage
            localStorage.setItem("studentMarks", JSON.stringify(studentMarks));
        
            document.getElementById(`total-${student_id}`).innerText = total;
            alert("Marks saved successfully!");
        }
        
    });
   
    
    
    document.addEventListener("DOMContentLoaded", fetchMarks);
    

    // Logout
    document.getElementById("logout").addEventListener("click", function () {
        localStorage.removeItem("userRole");
        window.location.href = "index.html";
    });
});
