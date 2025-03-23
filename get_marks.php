<?php
include "db.php"; // Database connection file


$sql = "SELECT student_id, physics, chemistry, maths, biology, 
        (physics + chemistry + maths + biology) AS total FROM marks";$result = $conn->query($sql);
$result = $conn->query($sql);

$marks = [];
while ($row = $result->fetch_assoc()) {
    $marks[] = $row;
}

header('Content-Type: application/json');
echo json_encode($marks, JSON_PRETTY_PRINT);
$conn->close();
?>
