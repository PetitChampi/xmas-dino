<?php

// getting data from database
$conn = mysqli_connect("localhost", "root", "", "dinogame");

if (!$conn) {
  die("Unable to Connect database: " . mysqli_connect_error());
}

?>