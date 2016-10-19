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

//chat route

//message route
