<?php
include 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $student_id = $_POST['student_id'];
    $name = $_POST['name'];
    $admission_no = $_POST['admission_no'];
    $roll_no = $_POST['roll_no'];
    $class_section = $_POST['class_section'];
    $father_name = $_POST['father_name'];
    $fee_status = $_POST['fee_status'];

    // Update query it
    $sql = "UPDATE students SET name=?, admission_no=?, roll_no=?, class_section=?, father_name=?, fee_status=? WHERE student_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssi", $name, $admission_no, $roll_no, $class_section, $father_name, $fee_status, $student_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }

    $stmt->close();
    $conn->close();
}
?>
