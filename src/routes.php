<?php
// Routes

$app->get('/', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");
    // return $response;
    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

$app->get('/admin', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");
    // return $response;
    // Render index view
    return $this->renderer->render($response, 'admin.phtml', $args);
});

//chat route

$app->post('/api/message', function ($request, $response, $args) {

    $contents;
    $body = $request->getParsedBody();
    $ip = 'test';

    try {
        $sql = "INSERT INTO messages VALUES (NULL, :username, :message, :ip, NOW())";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':username', $body['username']);
        $stmt->bindParam(':message', $body['text']);
        $stmt->bindParam(':ip', $ip);
        $stmt->execute();

    } catch (PDOException $pdoException) {
        // Do something with your error message, for now you could just:
         echo 'exception reached';
    }
    return $response;
});

$app->post('/api/user', function ($request, $response, $args) {

    $contents;
    $body = $request->getParsedBody();
    $name = $body['name'];
    $email = $body['email'];
    $online = true;

    try {
        $sql = "INSERT INTO users VALUES (NULL, :name, :email, :online, NOW())";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':online', $online);
        $stmt->execute();

    } catch (PDOException $pdoException) {
        // Do something with your error message, for now you could just:
         echo 'exception reached';
    }
    return $response;
});
