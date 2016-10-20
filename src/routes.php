<?php
// Routes

$app->get('/', function ($request, $response, $args) {
    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

$app->get('/admin', function ($request, $response, $args) {
    // Render index view
    return $this->renderer->render($response, 'admin.phtml', $args);
});

//chat route

$app->post('/api/message', function($request, $response, $args) {

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
           echo $pdoException->getMessage();
      }
      return $response;
});

$app->post('/api/user', function ($request, $response, $args) {

    $contents;
    $body = $request->getParsedBody();
    $name = $body['username'];
    $email = $body['email'];
    $online = 1;

    try {
        $sql = "INSERT INTO users VALUES (NULL, :name, :email, :online, NOW())";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':online', $online);
        $stmt->execute();

    } catch (PDOException $pdoException) {
        // Do something with your error message, for now you could just:
         echo $pdoException->getMessage();
    }
    return $response;
});

$app->get('/api/getmessages', function ($request, $response, $args) {

    $data;
    $newResponse;
    try {
        $sql = "SELECT name, email FROM users
              WHERE online = 1 LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $user = $stmt->fetch();
        if(!$user) {
          $data = array('username' => $user->name, 'email'=> $user->email, 'id'=> $user->id);
          $newResponse = $response->withJson($data);
          return $newResponse;
        } else {
          $data = array('username' => "", 'email'=> "", 'id'=> "$user->id");
          $newResponse = $response->withJson($data);
          return $newResponse;
        }

        //send response back with username, email, user_id
        // if(count($result) == 1) {
        //
        // }

    } catch (PDOException $pdoException) {
        // Do something with your error message, for now you could just:
         echo $pdoException->getMessage();
    }
});
