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
          $sql = "INSERT INTO messages VALUES (NULL, :username, :message, :ip, NOW(), :user_id)";
          $stmt = $this->db->prepare($sql);
          $stmt->bindParam(':username', $body['username']);
          $stmt->bindParam(':message', $body['text']);
          $stmt->bindParam(':user_id', $body['id']);
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
        //get new user id to send back in response
        $id = $this->db->lastInsertId();
        $data = array('id' => $id);
        //consider creating update function
        //that turns all other users to offline

        $newResponse = $response->withJson($data);
        return $newResponse;


    } catch (PDOException $pdoException) {
        // Do something with your error message, for now you could just:
         echo $pdoException->getMessage();
    }
    return $response;
});

$app->get('/api/getOnlineUser', function ($request, $response, $args) {

    $data;
    $newResponse;

    try {
        $sql = "SELECT name, email, id FROM users
              WHERE online = 1 LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_LAZY);
        if($user) {
          $data = array('username' => $user->name, 'email'=> $user->email, 'id'=> $user->id);
          $newResponse = $response->withJson($data);
          return $newResponse;
        } else {
          $data = array('username' => "", 'email'=> "", 'id'=> "");
          $newResponse = $response->withJson($data);
          return $newResponse;
        }

    } catch (PDOException $pdoException) {
         echo $pdoException->getMessage();
    }
});

$app->put('/api/userOffline/{user_id}', function ($request, $response, $args) {

    try {
        $sql = "UPDATE users SET online = 0 WHERE id = :user_id";
        $stmt = $this->db->prepare($sql);
        $user_id = $args['user_id'];
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_LAZY);
        return $response;

    } catch (PDOException $pdoException) {
         echo $pdoException->getMessage();
    }
});

$app->get('/api/getmessages/{user_id}', function ($request, $response, $args) {
  try {
    $sql = "SELECT username, message, date, user_id FROM messages
          WHERE user_id = :user_id ORDER BY date DESC";
    $stmt = $this->db->prepare($sql);
    $user_id = $args['user_id'];
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    $result = array();
    while($row = $stmt->fetchObject()) {
        $result[] = $row;
    }
    $newResponse = $response->withJson($result);
    return $newResponse;
  } catch (PDOException $pdoException) {
      // Do something with your error message, for now you could just:
       echo $pdoException->getMessage();
  }
});
