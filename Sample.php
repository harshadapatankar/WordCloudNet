<?php
$documentID = $_GET['DocId'];
$command = escapeshellcmd(' python /Users/sahilmirchandani/Desktop/Masters_CS/SEM-2/Sagar/WordCloudNet/Scripts/cloudGen.py -d '.$documentID);
$output = shell_exec($command);
echo $output;
echo "Ended";
?>