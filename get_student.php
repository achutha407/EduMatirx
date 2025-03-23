<?php
include 'db_config.php'; // Include your database connection file
include 'db.php';  // Include the database connection file

// Check if student ID is passed in the URL
if (isset($_GET['id'])) {
    $student_id = $_GET['id'];

    // Query to fetch student details based on student ID
    $sql = "SELECT * FROM students WHERE student_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $student_id); // "s" is for string type
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if the student exists
    if ($result->num_rows > 0) {
        $student = $result->fetch_assoc(); // Fetch student details
        echo json_encode($student); // Return student details as JSON
    } else {
        echo json_encode(["error" => "Student not found"]); // Return error if no student found
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "No student ID provided"]); // Return error if no ID is provided
}
?>
