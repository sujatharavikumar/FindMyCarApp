// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


/*new ionicPopup added*/
.controller('MapController', function($scope, $ionicLoading, $ionicPopup, CarPosition) {

    var username = "Suja's Car"
    var firebaseRef = new Firebase("https://myiphoneapp-2174a.firebaseio.com/");
    var geoFire = new GeoFire(firebaseRef);


    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions, CarPosition);

        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));


            var latitude = pos.coords.latitude;
            var longitude = pos.coords.longitude;

            CarPosition.latitude = latitude;
            CarPosition.longitude = longitude;
            console.log(CarPosition.latitude);
            console.log(CarPosition.longitude);

            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
                //icon: "./img/female-2.png"
            });



            $scope.findCar = function(){
              geoFire.get(username).then(function(location) {
                if (location === null) {
                  console.log( username + " is not in GeoFire");
                }
                else {
                  console.log(username + " is at location [" + location + "]");
                }
                var carLocation = new google.maps.Marker({
                  position: new google.maps.LatLng(location[0], location[1]),
                  map: map,
                  title: "Car Location",
                  icon: "./img/car1.png"
                });
              });
            };




        });

        $scope.map = map;

        $scope.savePosition = function(){

          geoFire.set(username, [CarPosition.latitude, CarPosition.longitude]);

          var alertPopup = $ionicPopup.alert({
            title:'Save the location',
            template: 'Your position has been saved'
          }).catch(function(error){
            console.log("Error adding user " + username + "'s location to GeoFire");
          });
          alertPopup.then(function(res) {
            // Custom functionality....
          });

        };




    });

})

.service('CarPosition', function(){
  var latitude;
  var longitude;
});
