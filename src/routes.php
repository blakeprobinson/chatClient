<?php
// Routes

$app->get('/[{name}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");
    $uri = $request->getUri();
    $username = $uri->getPath();
    $message = $username;
    $ip = $username;

    $statement = $this->db->query("INSERT INTO messages
        VALUES (NULL, '{$username}', '{$message}', '{$ip}', NOW())");
    if(!$statement) {
      var_dump($statement);
      die();
    }

    // return $response;
    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});


// public function addMessage($username, $message, $ip)
//   {
//       $username = addslashes($username);
//       $message = addslashes($message);
//
//       return (bool) $this->db->query("INSERT INTO messages
//           VALUES (NULL, '{$username}', '{$message}', '{$ip}', NOW())");
//   }
