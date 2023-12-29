<?php
$correct_password = "123456"; //设置密码

if (isset($_POST["password"])) {
    $input_password = $_POST["password"];

    if ($input_password === $correct_password) {
        echo "密码正确！";
    } else {
        echo "密码错误！";
    }
}
?>
