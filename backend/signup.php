<?php
header("Content-Type: application/json");

$file = "../users.json";
$users = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

$email = $_POST['email'] ?? "";
$password = $_POST['password'] ?? "";

if (isset($users[$email])) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
} else {
    $users[$email] = password_hash($password, PASSWORD_DEFAULT);
    file_put_contents($file, json_encode($users));
    echo json_encode(["success" => true]);
}
?>

