<?php

include "db.php";

$getDbData = mysqli_query($conn, "SELECT * FROM scores");

// storing query data in array
$dbData = array();
while ($row = mysqli_fetch_assoc($getDbData)) {
  $dbData[] = $row;
}

header('Content-type: application/json');

// Takes raw data from the request
$json = file_get_contents('php://input');

// Converts it into a PHP object
$load = json_decode($json);

$nickname = $load->nickname;
$score = $load->score;
$avatar = $load->avatar;

$scores = array();

foreach ($dbData as $item) {
  $scores[] = $item["score"];
  if ($item["nickname"] == $nickname) {
    $nameExists = true;
  }
}

if (!isset($nameExists)) {
  $query = "INSERT INTO scores (score, nickname, avatar)
  VALUES (?, ?, ?)";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("iss", $score, $nickname, $avatar);
  $stmt->execute();
} else {
  foreach ($scores as $item) {
    if ($item < $score) {
      $query = "UPDATE scores
      SET score = ?, avatar = ?
      WHERE nickname = ?";
      $stmt = $conn->prepare($query);
      $stmt->bind_param("iss", $score, $avatar, $nickname);
      $stmt->execute();
    }
  }
}

// Delete all records below the 20 highest scores
$deleteQuery = "DELETE FROM scores
WHERE id NOT IN
(
  SELECT * FROM (SELECT id FROM scores ORDER BY score DESC LIMIT 20) AS temp
)";

if (mysqli_query($conn, $deleteQuery)) {
  echo "Record deleted successfully";
} else {
  echo "Error deleting record: " . mysqli_error($conn);
}

mysqli_close($conn);

?>