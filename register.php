<?php
// Enable full error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json"); // Ensure JSON output

include 'db.php';

// Debug: Check if the request method is correct
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die(json_encode(["status" => "error", "message" => "This endpoint only accepts POST requests."]));
}

// Debug: Check if required fields are missing
if (!isset($_POST['email'], $_POST['password'], $_POST['role'])) {
    die(json_encode(["status" => "error", "message" => "Missing required fields."]));
}

// Retrieve data
$email = trim($_POST['email']);
$password = trim($_POST['password']);
$role = trim($_POST['role']);

// Debug: Check if values are empty
if (empty($email) || empty($password) || empty($role)) {
    die(json_encode(["status" => "error", "message" => "One or more fields are empty."]));
}

// Hash password
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

// Debug: Check if the database connection is working
if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

// Prepare SQL statement
// Check if the email already exists
$checkStmt = $conn->prepare("SELECT email FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    die(json_encode(["status" => "error", "message" => "Email already exists. Please use a different email."]));
}

$checkStmt->close();

// Now insert the user
$stmt = $conn->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $hashed_password, $role);

if (!$stmt) {
    die(json_encode(["status" => "error", "message" => "Prepare statement failed: " . $conn->error]));
}

$stmt->bind_param("sss", $email, $hashed_password, $role);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User registered successfully!"]);
} else {
    die(json_encode(["status" => "error", "message" => "User creation failed: " . $stmt->error]));
}

$stmt->close();
$conn->close();
?>
