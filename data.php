<?php

// getting data from database
$conn = mysqli_connect("localhost", "root", "", "dinogame");

// getting data from scores table
$result = mysqli_query($conn, "SELECT * FROM scores");

// storing data in array
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
  $data[] = $row;
}

// returning response in JSON
echo json_encode($data);

?>