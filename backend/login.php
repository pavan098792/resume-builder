<?php
session_start();
header("Content-Type: application/json");

$file = "../users.json";
$users = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

$email = $_POST['email'] ?? "";
$password = $_POST['password'] ?? "";

if (isset($users[$email]) && password_verify($password, $users[$email])) {
    $_SESSION['user'] = $email;
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}
error_log("Received email: " . $_POST['email']);
error_log("Received password: " . $_POST['password']);

?>
