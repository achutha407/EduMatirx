<?phpheader("Access-Control-Allow-Origin: *"); // Allow all origins (for testing)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include 'db.php';


// Mark Attendance
if ($_POST['action'] == "mark_attendance") {
    $student_id = $_POST['student_id'];
    $status = $_POST['status'];
    $date = date("Y-m-d");

    $stmt = $conn->prepare("INSERT INTO attendance (student_id, status, date) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $student_id, $status, $date);
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Attendance marked"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to mark attendance"]);
    }
}

// Add Marks
if ($_POST['action'] == "add_marks") {
    $student_id = $_POST['student_id'];
    $subject = $_POST['subject'];
    $marks = $_POST['marks'];

    $stmt = $conn->prepare("INSERT INTO marks (student_id, subject, marks) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $student_id, $subject, $marks);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Marks added"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to add marks"]);
    }
}

// Assign Fees
if ($_POST['action'] == "assign_fees") {
    $student_id = $_POST['student_id'];
    $amount = $_POST['amount'];
    $status = $_POST['status'];

    $stmt = $conn->prepare("INSERT INTO fees (student_id, amount, status) VALUES (?, ?, ?)");
    $stmt->bind_param("sis", $student_id, $amount, $status);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Fees assigned"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to assign fees"]);
    }
}
?>
