<?php
$documentID = $_GET['DocId'];

$command1 = escapeshellcmd('pwd');
$PATH = shell_exec($command1);
$command = escapeshellcmd($PATH.'/Scripts/wordCloudEnv/bin/python '.$PATH.'/Scripts/cloudGen.py -d '.$documentID);
$output = shell_exec($command);
echo "Ended";
?>