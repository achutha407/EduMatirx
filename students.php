<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $studentId = $_POST['student_id'];
    $admissionNo = $_POST['admission_no'];
    $rollNo = $_POST['roll_no'];
    $classSection = $_POST['class_section'];
    $gender = $_POST['gender'];
    $fatherName = $_POST['father_name'];
    $feeStatus = $_POST['fee_status'];

    $stmt = $conn->prepare("INSERT INTO students (name, student_id, admission_no, roll_no, class_section, gender, father_name, fee_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", $name, $studentId, $admissionNo, $rollNo, $classSection, $gender, $fatherName, $feeStatus);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Student added successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to add student"]);
    }
} else {
    // Fetch students from database
    $result = $conn->query("SELECT * FROM students");

    if (!$result) {
        die(json_encode(["status" => "error", "message" => "SQL Query Failed: " . $conn->error]));
    }
    
    $students = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($students);
    
}
?>
