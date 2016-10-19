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
$app->put('/api/message', function ($request, $response, $args) {
    // Sample log message
    var_dump($request);

    $this->logger->info("Slim-Skeleton '/' route");
    $contents;
    if($request->isPost()) {
      $parsedBody = $request->getParsedBody();
      $contents = $parsedBody->getContents();
    }
    $uri = "test";
    $username = "test";
    $message = $contents;
    $ip = $username;

    $statement = $this->db->query("INSERT INTO messages
        VALUES (NULL, '{$username}', '{$message}', '{$ip}', NOW())");
    if(!$statement) {
      var_dump($statement);
      die();
    }

    // return $response;
    // Render index view
    return $response;
});
