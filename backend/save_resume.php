<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$file = "resumes.json";
$resumes = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

$email = $_SESSION['user'];
$data = json_decode(file_get_contents("php://input"), true);

$resumes[$email] = $data;
file_put_contents($file, json_encode($resumes));

echo json_encode(["success" => true, "message" => "Resume saved!"]);
?>
