var app = angular.module("chatApp",[]);

app.factory("DataModel", function() {
  var Service = {};

  

  return Service;
});

app.controller("ChatController", function($scope) {
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
