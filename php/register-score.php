<?php

include "db.php";

$getDbData = mysqli_query($conn, "SELECT * FROM scores");

$dbData = array();
while ($row = mysqli_fetch_assoc($getDbData)) {
  $dbData[] = $row;
}

header('Content-type: application/json');

$json = file_get_contents('php://input');
$load = json_decode($json);

$nickname = $load->nickname;
$score = $load->score;
$avatar = $load->avatar;

foreach ($dbData as $item) {
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
  foreach ($dbData as $item) {
    if ($item["nickname"] == $nickname && $score > $item["score"]) {
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
  echo "\n Record deleted successfully";
} else {
  echo "\n Error deleting record: " . mysqli_error($conn);
}

mysqli_close($conn);

?>