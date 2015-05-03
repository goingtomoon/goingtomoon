var goingToMoon = angular.module("goingToMoon", ["firebase", "ngRoute"]);

// register work which should be performed when the injector is done loading all modules
goingToMoon.run(["$rootScope", "$timeout",
	function($rootScope, $timeout) {
		$rootScope.showTitle = false;
	    $timeout(function() {
	    	$rootScope.showTitle = !$rootScope.showTitle;
	    }, 1000);

	    //check for localStorage support
	    if(typeof(Storage) !== "undefined") {
	    	$rootScope.hasStorage = true;
		} else {
			$rootScope.hasStorage = false;
		}
	}
]);

goingToMoon.config(["$routeProvider",
	function($routeProvider) {
		$routeProvider.
			when("/items", {
			    templateUrl: "items.html",
			    controller: "ItemsCtrl"
	  		}).
	  		when("/items/:itemId", {
	    		templateUrl: "item.html",
	    		controller: "ItemDetailsCtrl"
	  		}).
	  		otherwise({
	    		redirectTo: "/items"
	  		});
	}
]);

goingToMoon.controller("ItemsCtrl", ["$scope", "$firebase",
	function($scope, $firebase) {
		var fb = new Firebase("https://crackling-fire-2235.firebaseio.com/items");
		var sync = $firebase(fb);	// create an AngularFire reference to the data
	    $scope.items = sync.$asArray();		// download and synchronize data into a local object (=read only)

		$scope.tag = "";
		$scope.popup = {active: false};
		$scope.itemDetails = "";

		$scope.setViews = function(itemId) {
			fb.child(itemId + "/stats/views").set(++$scope.items[itemId].stats.views);
	    }

		$scope.setTag = function(tag) {
			$scope.tag = tag;
	    }

	    $scope.toggleStar = function(itemId){
	    	if ($scope.hasStorage){
	    		if (localStorage.getItem("item-" + itemId) === null){
	    			localStorage.setItem("item-" + itemId, "true");
	    			$scope.items[itemId].stats.stars++;
	    		}else{
	    			localStorage.removeItem("item-" + itemId);
	    			$scope.items[itemId].stats.stars--;
	    		}
	    		fb.child("/" + itemId + "/stats/stars").set($scope.items[itemId].stats.stars);
	    		//Using Angular Fire
	    		// $scope.items.$save($scope.items.$indexFor(itemId));	//saves entire item?
	    	}
	    }

	    $scope.isStarred = function(itemId){
	    	if ($scope.hasStorage){
	    		if (localStorage.getItem("item-" + itemId) !== null){
	    			return true;
	    		}
	    	}
	    	return false;
	    }
	}
]);

goingToMoon.controller("ItemDetailsCtrl", ["$scope", "$firebase", "$routeParams", "$timeout",
	function($scope, $firebase, $routeParams, $timeout) {
		$scope.invalid = "";
		$scope.itemId = $routeParams.itemId;
		$scope.allowAddComment = true;

		var fb = new Firebase("https://crackling-fire-2235.firebaseio.com/itemDetails/" + $scope.itemId);
		fb.once("value", function(snapshot) {
			if (snapshot){
				$timeout(function() {
					$scope.name = snapshot.val().name;
					$scope.description = snapshot.val().description;
					$scope.price = snapshot.val().price;
					$scope.images = snapshot.val().images;
					$scope.comments = snapshot.val().comments;

					$scope.setImage($scope.images[0]);
      				$scope.data = snapshot.val();
				});
			}
		}, function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		});

		$scope.setImage = function(imgURL){
			$scope.mainImage = imgURL;
		}

		$scope.addComment = function(comment){
			if ($scope.newComment.$invalid){
				$scope.invalid = "invalid";
			}
			if ($scope.newComment.author.$invalid){
				$scope.invalid = "invalid";
			}
			if ($scope.newComment.$valid){
				fb.child("comments").push({
				  author: comment.author,
				  comment: comment.comment,
				  timestamp: Firebase.ServerValue.TIMESTAMP
				});
				$scope.allowAddComment = false;

				var commentStats = new Firebase("https://crackling-fire-2235.firebaseio.com/items/" + $scope.itemId + "/stats/comments");
				commentStats.once("value", function(snapshot) {
					if (snapshot){
						var count = snapshot.val();
						commentStats.set(++count);
					}
				});
			}
		}
	}
]);

goingToMoon.controller("contactCtrl", ["$scope", "$firebase",
	function($scope, $firebase) {
		$scope.sendFeedback = function(feedback){
			if ($scope.feedback.$valid){
				var fb = new Firebase("https://crackling-fire-2235.firebaseio.com/feedback");
				fb.push({
				  name: feedback.name,
				  email: feedback.email,
				  message: feedback.message,
				  timestamp: Firebase.ServerValue.TIMESTAMP
				});
				$("#feedback").css("opacity", "0");
			}
		}

	}
]);

goingToMoon.directive("animateOnScroll", function() {
	return {
		restrict: "A",
		link: function(scope, el, attrs) {
			var bottom = $(window).scrollTop() + $(window).height();
			var item = $(el).offset().top + $(el).height();

			if ($(el).is(".item"))
				if (item - 100 < bottom)
					$(el).addClass("fadeIn");

			$(window).scroll( function(){
				bottom = $(window).scrollTop() + $(window).height();
		        item = $(el).offset().top + $(el).height();

		        //refactor
		        if ($(el).is(".item")){
		        	if (item - 100 < bottom)
		        		$(el).addClass("fadeIn");
		        }
		        else if (item + 100 < bottom){
		        	$(el).addClass("fadeIn");
		        }
			});
    	}
  	}
});

goingToMoon.directive("scrollOnClick", function() {
	return {
		restrict: "A",
		link: function(scope, $el, attrs) {
			var scrollTo = attrs.href;
			$el.on("click", function() {
				var $target = (scrollTo)? $(scrollTo) : $el;
	        	$("body").animate({scrollTop: $target.offset().top}, 1000, "easeOutCubic");
			});
    	}
  	}
});

goingToMoon.directive("gtmComment", function() {
	return {
		restrict: "E",
    	template: "<h3>{{comment.author}}<span> {{comment.timestamp | date:'dd/MM, HH:mm'}}</span></h3>" +
    			   "<p>{{comment.comment}}</p>"
  	};
});
