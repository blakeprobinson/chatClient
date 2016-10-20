var app = angular.module("chatApp",[]);

app.factory("DataModel", function($http) {
  var service = {};

  service.sendMessage = function(chat) {

    console.log(chat);
    //return $http.put('api/message', JSON.stringify(chat));
    return $http.post('api/message', chat).success(function(data) {
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

  $scope.formatChat = function(icon,username,text,origDt) {
    var chat = {};
    chat.icon = icon;
    chat.username = username;
    chat.text = text;
    chat.origDt = origDt;
    return chat;
  }

  $scope.addChat = function() {
    if ($scope.newChatMsg != "") {
      var chat = $scope.formatChat("http://placehold.it/16x16",
                           "steve",
                           $scope.newChatMsg,
                           new Date());

      $scope.chatMessages.push(chat);
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