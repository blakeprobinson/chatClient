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

  service.getOnlineUser = function() {
    //check to see if any users are online
    //return that users messages...
    return $http.get('api/getOnlineUser', {});

  }

  service.getMessages = function(data, url) {
    return $http.get(url, {});
  }

  return service;
});

app.controller("ChatController", function($scope, DataModel, $http) {
  $scope.chatMessages = [];
  $scope.pidMessages = null;
  $scope.user = {};
  $scope.adminName = "";

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
      DataModel.getOnlineUser().then(function(data){
        var id = data.data.id;
        if(id !=="") {
          var id = data.data.id;
          var url = 'api/getmessages/' + id;
          $scope.user.username = data.data.username;
          $scope.user.email = data.data.email;
          $scope.user.userId = data.data.id;
          console.log('this is scope.user', $scope.user);
            return DataModel.getMessages(data, url);
        } else {

        }
      }).then(function(data){
        $scope.chatMessages = data.data.map(function(element) {
          return $scope.formatChat(element.username, element.message, element.date, element.user_id);
      });
      });
      //$scope.listMessages();
      //re-list all the messages by pulling them from the server every 3sec.
      //$scope.pidMessages = window.setInterval($scope.listMessages, 3000);
  };

  $scope.addAdmin = function() {
    var panel = document.getElementsByClassName("panel")[0];
    panel.style.display = "none";
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

  $scope.formatChat = function(username,text,origDt, userId) {
    var chat = {};
    chat.username = username;
    chat.text = text;
    chat.origDt = origDt;
    chat.id = userId;
    return chat;
  }

  $scope.addChat = function() {
    //keep div scrolled down if necessary
    var scrollDiv = document.getElementsByClassName("scroll-div")[0];
    var table = document.getElementsByClassName("table")[0];
    scrollDiv.scrollTop = table.clientHeight;


    if ($scope.newChatMsg != "") {
      var chat = $scope.formatChat(
                           $scope.user.username,
                           $scope.newChatMsg,
                           new Date(),
                           $scope.user.userId);

      $scope.chatMessages.unshift(chat);
      DataModel.sendMessage(chat).then(function(response) {
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
