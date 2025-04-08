<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'db.php';  // Include the database connection file

// Check if the 'id' parameter is set in the URL 
if (isset($_GET['id'])) {
    $studentId = $_GET['id'];

    // Your database connection details
    $servername = "localhost";
    $username = "your_db_username";
    $password = "your_db_password";
    $dbname = "college_management"; // The name of your database

    // Create connection
    $conn = new mysqli('localhost', 'root', '', 'college_management');

    // Check if the connection is successful
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // SQL query to delete the student record
    $sql = "DELETE FROM students WHERE student_id = ?";

    // Prepare the SQL statement
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $studentId);  // 's' means string

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error deleting student."]);
    }
    
    // Close the prepared statement and database connection
    $stmt->close();
    $conn->close();
} else {
    // Return failure response if 'id' is not set
    echo json_encode(["success" => false, "message" => "Student ID not provided"]);
}
?>
