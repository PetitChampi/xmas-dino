<?php

include "db.php";

// getting data from scores table
$result = mysqli_query($conn, "SELECT * FROM scores ORDER BY score DESC LIMIT 20");

// storing data in array
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
  $data[] = $row;
}

// returning response in JSON
echo json_encode($data);

?>