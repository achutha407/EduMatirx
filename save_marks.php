<?php
require 'db_connect.php'; // Your database connection file

$data = json_decode(file_get_contents("php://input"));

$studentId = $data->studentId;
$physics = $data->physics;
$chemistry = $data->chemistry;
$maths = $data->maths;
$biology = $data->biology;
$total = $data->total;

// Insert or update marks
$sql = "INSERT INTO marks (student_id, total_marks, physics, chemistry, maths, biology) 
        VALUES ('$studentId', '$physics', '$chemistry', '$maths', '$biology', '$total') 
        ON DUPLICATE KEY UPDATE 
        physics='$physics', chemistry='$chemistry', maths='$maths', biology='$biology', total='$total'";

if (mysqli_query($conn, $sql)) {
    echo "success";
} else {
    echo "error";
}

mysqli_close($conn);
?>
