<?php
//set up cloud db for local and prod
$url;
$server;
$username;
$password;
$db;


if(getenv("JAWSDB_MARIA_URL")) {
  $url = parse_url(getenv("JAWSDB_MARIA_URL"));
  $server = $url["host"];
  $username = $url["user"];
  $password = $url["pass"];
  $db = ltrim($url['path'],'/');
} else {
  $url = parse_url('mysql://b222547e5e1c7a:9fe8fc3f@us-cdbr-iron-east-04.cleardb.net/heroku_7a1e3191145a93c?reconnect=true');
  $server = 'localhost';
  $username = "root";
  $password = "root";
  $db = "spachat";
}
return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        //database settings
        'db' => [
          'host' => $server,
          'user' => $username,
          'pass' => $password,
          'dbname' => $db,
        ],

        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => __DIR__ . '/../logs/app.log',
            'level' => \Monolog\Logger::DEBUG,
        ],
    ],
];
