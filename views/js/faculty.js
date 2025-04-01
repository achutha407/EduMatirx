document.addEventListener("DOMContentLoaded", () => {
    console.log("Faculty Page: Loading students...");
    loadStudents();
});

function openTab(event, tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(tab => tab.classList.remove("active"));

    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");
}

function loadStudents() {
    let dbRequest = indexedDB.open("AdvityaDB", 1);

    dbRequest.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction("students", "readonly");
        let studentStore = transaction.objectStore("students");

        let studentTable = document.querySelector("#studentTable tbody");
        let attendanceTable = document.querySelector("#attendanceTable tbody");
        let marksTable = document.querySelector("#marksTable tbody");
        let feesTable = document.querySelector("#feesTable tbody");

        studentTable.innerHTML = "";
        attendanceTable.innerHTML = "";
        marksTable.innerHTML = "";
        feesTable.innerHTML = "";

        studentStore.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                let student = cursor.value;

                if (!student || !student.ID) {
                    console.warn("Skipping undefined student record:", student);
                    cursor.continue();
                    return;
                }

                let genderEmoji = student.Gender === "Male" ? "👦" : "👧";

                // Dashboard Table
               // Dashboard Table
studentTable.innerHTML += `
<tr id="row_${student.ID}">
    <td>${student.ID} ${genderEmoji}</td>
    <td>${student.Name}</td>
    <td>${student.Class}</td>
    <td>${student.Department}</td>
    <td class="action-column">
        <button class="delete-btn" onclick="deleteStudent('${student.ID}')">❌ Delete</button>
    </td>
</tr>`;


                // Attendance Table
                attendanceTable.innerHTML += `
                    <tr>
                        <td>${student.ID}</td>
                        <td>${student.Name}</td>
                        <td><input type="radio" name="attendance_${student.ID}" value="Present"></td>
                        <td><input type="radio" name="attendance_${student.ID}" value="Absent"></td>
                    </tr>`;

                // Marks Table
               // Marks Table
marksTable.innerHTML += `
<tr>
    <td>${student.ID}</td>
    <td>${student.Name}</td>
    <td><input type="number" id="sub1_${student.ID}" value="${student.sub1 || 0}" oninput="validateMarks(this)"></td>
    <td><input type="number" id="sub2_${student.ID}" value="${student.sub2 || 0}" oninput="validateMarks(this)"></td>
    <td><input type="number" id="sub3_${student.ID}" value="${student.sub3 || 0}" oninput="validateMarks(this)"></td>
    <td><input type="number" id="sub4_${student.ID}" value="${student.sub4 || 0}" oninput="validateMarks(this)"></td>
    <td id="total_${student.ID}">${student.total || 0}</td>
    <td id="percentage_${student.ID}">${student.percentage || 0}%</td>
</tr>`;

                // Fees Table
                feesTable.innerHTML += `
                    <tr>
                        <td>${student.ID}</td>
                        <td>${student.Name}</td>
                        <td><input type="number" id="fee_${student.ID}" value="${student.fee || 0}"></td>
                    </tr>`;

                cursor.continue();
            } else {
                console.log("No more students found.");
            }
        };
    };

    dbRequest.onerror = function () {
        console.error("Error opening IndexedDB");
    };
}

function deleteStudent(ID) {
    let dbRequest = indexedDB.open("AdvityaDB", 1);

    dbRequest.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction("students", "readwrite");
        let studentStore = transaction.objectStore("students");

        let deleteRequest = studentStore.delete(ID);

        deleteRequest.onsuccess = function () {
            console.log(`Student ${ID} deleted.`);
            document.getElementById(`row_${ID}`).remove(); // Remove row from UI
        };

        deleteRequest.onerror = function () {
            console.error(`Failed to delete student ${ID}`);
        };
    };
}
function submitAttendance() {
    let dbRequest = indexedDB.open("AdvityaDB", 1);

    dbRequest.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction("students", "readwrite");
        let studentStore = transaction.objectStore("students");

        studentStore.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                let student = cursor.value;
                let attendance = document.querySelector(`input[name="attendance_${student.ID}"]:checked`);
                if (attendance) {
                    student.attendance = attendance.value;
                    studentStore.put(student);
                }
                cursor.continue();
            } else {
                showNotification("Attendance submitted successfully!");
            }
        };
    };
}

function submitMarks() {
    let dbRequest = indexedDB.open("AdvityaDB", 1);

    dbRequest.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction("students", "readwrite");
        let studentStore = transaction.objectStore("students");

        studentStore.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                let student = cursor.value;

                let sub1 = parseInt(document.getElementById(`sub1_${student.ID}`).value) || 0;
                let sub2 = parseInt(document.getElementById(`sub2_${student.ID}`).value) || 0;
                let sub3 = parseInt(document.getElementById(`sub3_${student.ID}`).value) || 0;
                let sub4 = parseInt(document.getElementById(`sub4_${student.ID}`).value) || 0;

                let total = sub1 + sub2 + sub3 + sub4;
                let percentage = (total / 400) * 100;

                student.sub1 = sub1;
                student.sub2 = sub2;
                student.sub3 = sub3;
                student.sub4 = sub4;
                student.total = total;
                student.percentage = percentage.toFixed(2);

                document.getElementById(`total_${student.ID}`).innerText = total;
                document.getElementById(`percentage_${student.ID}`).innerText = `${percentage.toFixed(2)}%`;

                studentStore.put(student);
                cursor.continue();
            } else {
                showNotification("Marks submitted successfully!");
            }
        };
    };
}

function submitFees() {
    let dbRequest = indexedDB.open("AdvityaDB", 1);

    dbRequest.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction("students", "readwrite");
        let studentStore = transaction.objectStore("students");

        studentStore.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                let student = cursor.value;
                let feeAmount = parseInt(document.getElementById(`fee_${student.ID}`).value) || 0;
                student.fee = feeAmount;
                studentStore.put(student);
                cursor.continue();
            } else {
                showNotification("Fees assigned successfully!");
            }
        };
    };
}

function logout() {
    window.location.href = "index.html";
}

function validateMarks(input) {
    let value = parseInt(input.value);
    if (value > 100) {
        alert("Marks cannot be greater than 100!");
        input.value = 100;  // Reset to 100 if exceeded
    } else if (value < 0) {
        alert("Marks cannot be negative!");
        input.value = 0;  // Reset to 0 if negative
    }
}

function showNotification(message, color = "#28a745") {
    let notification = document.getElementById("notification");
    notification.innerText = message;
    notification.style.backgroundColor = color;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000); // Hide after 3 seconds
}
