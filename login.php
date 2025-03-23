<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'C:\xampp\php\logs\php_error.log');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

// ✅ Check Database Connection
if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . mysqli_connect_error()]));
}

// ✅ Check if POST request is received
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die(json_encode(["status" => "error", "message" => "This endpoint only accepts POST requests."]));
}

$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;

// ✅ Check if email & password are received
if (!$email || !$password) {
    die(json_encode(["status" => "error", "message" => "Email or Password missing."]));
}

// ✅ Fetch user from database
$stmt = $conn->prepare("SELECT email, password, role FROM users WHERE email = ?");

// ✅ Check if SQL Prepare Fails
if (!$stmt) {
    die(json_encode(["status" => "error", "message" => "SQL Prepare Failed: " . $conn->error]));
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// ✅ If User Not Found
if (!$user) {
    die(json_encode(["status" => "error", "message" => "User not found"]));
}

// ✅ Verify Password
if (!password_verify($password, $user['password'])) {
    die(json_encode(["status" => "error", "message" => "Incorrect password"]));
}

// ✅ Success: Return Role
echo json_encode(["status" => "success", "role" => $user["role"]]);
exit;
?>
