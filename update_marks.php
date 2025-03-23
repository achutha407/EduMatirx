<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    die(json_encode(["status" => "error", "message" => "Invalid JSON input"]));
}

$student_id = $data['student_id'];
$physics = (int)$data['physics'];
$chemistry = (int)$data['chemistry'];
$maths = (int)$data['maths'];
$biology = (int)$data['biology'];
$total = $physics + $chemistry + $maths + $biology;

$sql = "UPDATE marks SET physics=$physics, chemistry=$chemistry, maths=$maths, biology=$biology, total=$total WHERE student_id='$student_id'";

if ($conn->query($sql)) {
    echo json_encode(["status" => "success", "message" => "Marks updated"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update marks"]);
}
$conn->close();
?>
