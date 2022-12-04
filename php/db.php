<?php

$conn = mysqli_connect("localhost", "root", "", "dinogame");

if (!$conn) {
  die("Unable to connect database: " . mysqli_connect_error());
}

?>