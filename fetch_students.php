<?php
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "";
$db = "college_management";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

if (!isset($_GET['student_id'])) {
    die(json_encode(["error" => "No Student ID provided"]));
}

$student_id = $conn->real_escape_string($_GET['student_id']);
$query = "SELECT * FROM students WHERE student_id = '$student_id'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $student = $result->fetch_assoc();
    echo json_encode($student);
} else {
    echo json_encode(["error" => "Student not found"]);
}

$conn->close();
?>
