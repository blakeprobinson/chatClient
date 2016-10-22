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

  service.makeUserOffline = function(user) {
    var id = user.userId;
    var url = 'api/userOffline/' + id;
    return $http.put(url, {});
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

app.controller("ChatController", function($scope, DataModel, $http, $q) {
  $scope.chatMessages = [];
  $scope.pidMessages = null;
  $scope.user = {};
  $scope.adminName = "";
  $scope.adminTitle = "Rep Chat";
  $scope.chatFiller = "Where are all the customers?";

  $scope.listMessages = function(wasListingForMySubmission) {
      DataModel.getOnlineUser().then(function(data){
        var id = data.data.id;
        if(id !=="") {
          var id = data.data.id;
          var url = 'api/getmessages/' + id;
          $scope.user.username = data.data.username;
          $scope.user.email = data.data.email;
          $scope.user.userId = data.data.id;
          $scope.adminTitle = 'You are chatting with '+$scope.user.username + ', '+ $scope.user.email;
            return DataModel.getMessages(data, url);
        } else {
          var defer = $q.defer();
          if($scope.chatMessages.length > 0) {
            $scope.chatMessages = [];
            $scope.pidMessages = null;
            $scope.user = {};
            $scope.adminTitle = "Rep Chat";
            $scope.chatFiller = "Where are all the customers?";
          }
          defer.reject('no users online')
          return defer.promise;
        }
      }).then(function(data){
        console.log('this is data.data', data.data);
        if(Object.prototype.toString.call( data.data ) === '[object Array]') {
          $scope.chatMessages = data.data.map(function(element) {
            return $scope.formatChat(element.author, element.message, element.date, element.user_id);
          });
        }

      }, function(error) {
        console.log(error);
      });
    };

  $scope.beginCheckingForMessages = function() {
      //get all the messages to start.
      $scope.listMessages();
      //re-list all the messages by pulling them from the server every 3sec.
      $scope.pidMessages = window.setInterval($scope.listMessages, 3000);
  };

  $scope.addAdmin = function() {
    var panel = document.getElementsByClassName("panel")[0];
    panel.style.display = "none";
    var chatBox = document.getElementsByClassName("chatbox")[0];
    chatBox.style.display = "block";
    $scope.beginCheckingForMessages();
  };

  $scope.addUser = function() {
    console.log('got to add user');
    var user = {};
    user.username = $scope.user.username;
    user.email = $scope.user.email;

    //need to validate.

    //bring up the chat window
    var chatWindow = document.getElementById("user-chatbox");
    chatWindow.style.bottom = "-20px";

    var loginWindow = document.getElementById("user-info-modal");
    loginWindow.style.bottom = "-300px";

    DataModel.createUser(user).then(function(response) {
      $scope.user.userId = response.data.id;
      console.log(response.data.id);
      //begin
      $scope.beginCheckingForMessages();
    });


  }

  $scope.formatChat = function(author,text,origDt, userId) {
    var chat = {};
    chat.author = author;
    chat.text = text;
    chat.origDt = (typeof origDt === 'string') ? formatDate(origDt):origDt;
    chat.id = userId;
    return chat;
  }

  function formatDate (sqlDate) {
    var dateArr = sqlDate.split(/[- :]/);
    return new Date(dateArr[0], dateArr[1]-1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]);
  };

  $scope.addChat = function() {
    //if admin tries to add chat without a user
    if($scope.adminTitle == "Rep Chat") {
      $scope.chatFiller = "You'll need to wait to chat until a user logs in.";
    } else {
      //keep div scrolled down if necessary
      var scrollDiv = document.getElementsByClassName("scroll-div")[0];
      var table = document.getElementsByClassName("table")[0];
      scrollDiv.scrollTop = table.clientHeight;

      if ($scope.newChatMsg != "") {
        var chat;
        //if chat is from user since adminName
        //is not populated.
        if($scope.adminName === "") {
          chat = $scope.formatChat(
                               $scope.user.username,
                               $scope.newChatMsg,
                               new Date(),
                               $scope.user.userId);
        } else {
          console.log('this is admin name', $scope.adminName);
          chat = $scope.formatChat(
                               $scope.adminName,
                               $scope.newChatMsg,
                               new Date(),
                               $scope.user.userId);
        }
        $scope.chatMessages.unshift(chat);
        DataModel.sendMessage(chat).then(function(response) {
          console.log(response)
        }, function(response) {console.log(response)});
          $scope.newChatMsg = "";
      }
      else {

      }
    }
  };

  $scope.acceptInvite = function() {
    //if a user already exists
    if($scope.user.username) {
      var userChatbox = document.getElementById("user-chatbox");
      userChatbox.style.bottom = "-20px";
    } else {
      var loginWindow = document.getElementById("user-info-modal");
      loginWindow.style.bottom = "-20px";
    }

    var inviteButton = document.getElementById("chat-button");
    inviteButton.style.bottom = "-150px";
  };

  $scope.endChat = function() {
    var userChatbox = document.getElementById("user-chatbox");
    userChatbox.style.bottom = "-350px";
    var inviteButton = document.getElementById("chat-button");
    inviteButton.style.bottom = "0px";
    DataModel.makeUserOffline($scope.user).then(function(data) {
      $scope.listMessages();
    });
  }

});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
