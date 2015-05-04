var goingToMoon = angular.module("goingToMoon", ["firebase", "ngRoute"]);
<<<<<<< HEAD

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
=======
goingToMoon.run(["$rootScope","$timeout",function(o,e){o.showTitle=!1,e(function(){o.showTitle=!o.showTitle},1e3),o.hasStorage="undefined"!=typeof Storage?!0:!1}]);
goingToMoon.config(["$routeProvider",function(e){e.when("/items",{templateUrl:"items.html",controller:"ItemsCtrl"}).when("/items/:itemId",{templateUrl:"item.html",controller:"ItemDetailsCtrl"}).otherwise({redirectTo:"/items"})}]);
goingToMoon.controller("ItemsCtrl",["$scope","$firebase",function(e,t){var i=new Firebase("https://crackling-fire-2235.firebaseio.com/items"),a=t(i);e.items=a.$asArray(),e.tag="",e.popup={active:!1},e.itemDetails="",e.setViews=function(t){i.child(t+"/stats/views").set(++e.items[t].stats.views)},e.setTag=function(t){e.tag=t},e.toggleStar=function(t){e.hasStorage&&(null===localStorage.getItem("item-"+t)?(localStorage.setItem("item-"+t,"true"),e.items[t].stats.stars++):(localStorage.removeItem("item-"+t),e.items[t].stats.stars--),i.child("/"+t+"/stats/stars").set(e.items[t].stats.stars))},e.isStarred=function(t){return e.hasStorage&&null!==localStorage.getItem("item-"+t)?!0:!1}}]),goingToMoon.controller("ItemDetailsCtrl",["$scope","$firebase","$routeParams","$timeout",function(e,t,i,a){e.invalid="",e.itemId=i.itemId,e.allowAddComment=!0;var o=new Firebase("https://crackling-fire-2235.firebaseio.com/itemDetails/"+e.itemId);o.once("value",function(t){t&&a(function(){e.name=t.val().name,e.description=t.val().description,e.price=t.val().price,e.images=t.val().images,e.comments=t.val().comments,e.setImage(e.images[0]),e.data=t.val()})},function(e){console.log("The read failed: "+e.code)}),e.setImage=function(t){e.mainImage=t},e.addComment=function(t){if(e.newComment.$invalid&&(e.invalid="invalid"),e.newComment.author.$invalid&&(e.invalid="invalid"),e.newComment.$valid){o.child("comments").push({author:t.author,comment:t.comment,timestamp:Firebase.ServerValue.TIMESTAMP}),e.allowAddComment=!1;var i=new Firebase("https://crackling-fire-2235.firebaseio.com/items/"+e.itemId+"/stats/comments");i.once("value",function(e){if(e){var t=e.val();i.set(++t)}})}}}]),goingToMoon.controller("contactCtrl",["$scope","$firebase",function(e){e.sendFeedback=function(t){if(e.feedback.$valid){var i=new Firebase("https://crackling-fire-2235.firebaseio.com/feedback");i.push({name:t.name,email:t.email,message:t.message,timestamp:Firebase.ServerValue.TIMESTAMP}),$("#feedback").css("opacity","0")}}}]),goingToMoon.directive("animateOnScroll",function(){return{restrict:"A",link:function(e,t){var i=$(window).scrollTop()+$(window).height(),a=$(t).offset().top+$(t).height();$(t).is(".item")&&i>a-100&&$(t).addClass("fadeIn"),$(window).scroll(function(){i=$(window).scrollTop()+$(window).height(),a=$(t).offset().top+$(t).height(),$(t).is(".item")?i>a-100&&$(t).addClass("fadeIn"):i>a+100&&$(t).addClass("fadeIn")})}}}),goingToMoon.directive("scrollOnClick",function(){return{restrict:"A",link:function(e,t,i){var a=i.href;t.on("click",function(){var e=a?$(a):t;$("body").animate({scrollTop:e.offset().top},1e3,"easeOutCubic")})}}}),goingToMoon.directive("gtmComment",function(){return{restrict:"E",template:"<h3>{{comment.author}}<span> {{comment.timestamp | date:'dd/MM, HH:mm'}}</span></h3><p>{{comment.comment}}</p>"}});
>>>>>>> origin/gh-pages
