var app = angular.module("chatApp",[]);

app.factory("DataModel", function($http) {
  var service = {};

  service.sendMessage = function(message) {
    var data = {
      "message":"test"
    };
    console.log(data);


    return $http.put('api/message', JSON.stringify(data));
  }



  return service;
});

app.controller("ChatController", function($scope, DataModel) {
  $scope.chatMessages = [];

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
      DataModel.sendMessage(chat).then(function(response) {
        console.log(response)
      }, function(response) {console.log(response)});
      $scope.newChatMsg = "";
    }
    else {

    }
  }

});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
