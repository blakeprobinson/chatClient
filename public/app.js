var app = angular.module("chatApp",[]);

app.factory("DataModel", function($http) {
  var service = {};

  service.sendMessage = function(chat) {

    console.log(chat);
    //return $http.put('api/message', JSON.stringify(chat));
    return $http.post('api/message', chat);
  }

  service.createUser = function(user) {

    return $http.post('api/user', user).success(function(data) {
                console.log(data);
            });
  }

  service.getMessages = function() {
    //check to see if any users are online
    //return that users messages...
    return $http.get('api/getmessages', {}).success(function(data) {
                console.log(data);
            });
  }



  return service;
});

app.controller("ChatController", function($scope, DataModel, $http) {
  $scope.chatMessages = [];
  $scope.pidMessages = null;

  $scope.listMessages = function(wasListingForMySubmission) {
        return $http.post($scope.urlListMessages, {}).success(function(data) {
            $scope.messages = [];
            //loop through messages in data returned
            angular.forEach(data, function(message) {
                //remove shortcodes from message
                message.message = $scope.replaceShortcodes(message.message);
                //add all returned messages to the $scope
                $scope.messages.push(message);
            });
            var lastMessage = $scope.getLastMessage();
            var lastMessageId = lastMessage && lastMessage.id;
            if ($scope.lastMessageId !== lastMessageId) {
                $scope.onNewMessage(wasListingForMySubmission);
            }
            $scope.lastMessageId = lastMessageId;
        });
    };

  $scope.init = function() {
      //get all the messages to start.
      //$scope.listMessages();
      //re-list all the messages by pulling them from the server every 3sec.
      //$scope.pidMessages = window.setInterval($scope.listMessages, 3000);
  };

  $scope.addUser = function() {
    var user = {};
    user.username = $scope.user.username;
    user.email = $scope.user.email;

    //need to validate.

    //bring up the chat window
    var chatWindow = document.getElementById("chat-window");
    chatWindow.style.bottom = "0px";

    DataModel.createUser(user).then(function(response) {
      $scope.user.userId = response.data.id;
      console.log(response.data.id);
    });
  }

  $scope.formatChat = function(icon,username,text,origDt, userId) {
    var chat = {};
    chat.icon = icon;
    chat.username = username;
    chat.text = text;
    chat.origDt = origDt;
    chat.id = userId;
    return chat;
  }

  $scope.addChat = function() {
    //keep div scrolled down if necessary
    var scrollDiv = document.getElementById("scroll-div");
    var table = document.getElementById("table");

    console.log(table.clientHeight);
    scrollDiv.scrollTop = table.clientHeight;


    if ($scope.newChatMsg != "") {
      var chat = $scope.formatChat("http://placehold.it/16x16",
                           "steve",
                           $scope.newChatMsg,
                           new Date(),
                           $scope.userId);

      $scope.chatMessages.unshift(chat);
      DataModel.sendMessage(chat, "username").then(function(response) {
        console.log(response)
      }, function(response) {console.log(response)});
        $scope.newChatMsg = "";
    }
    else {

    }
  }
  $scope.init();

});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
