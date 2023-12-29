<?php
$correct_password = "1134";

if (isset($_POST["password"])) {
    $input_password = $_POST["password"];

    if ($input_password === $correct_password) {
        echo "密码正确！";
    } else {
        echo "密码错误！";
    }
}
?>
