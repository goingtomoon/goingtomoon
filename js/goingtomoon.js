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
goingToMoon.controller("ItemsCtrl",["$scope","$firebase",function(e,t){var i=new Firebase("https://crackling-fire-2235.firebaseio.com/items"),a=t(i);e.items=a.$asArray(),e.tag="",e.popup={active:!1},e.itemDetails="",e.setViews=function(t){i.child(t+"/stats/views").set(++e.items[t].stats.views)},e.setTag=function(t){e.tag=t},e.toggleStar=function(t){e.hasStorage&&(null===localStorage.getItem("item-"+t)?(localStorage.setItem("item-"+t,"true"),e.items[t].stats.stars++):(localStorage.removeItem("item-"+t),e.items[t].stats.stars--),i.child("/"+t+"/stats/stars").set(e.items[t].stats.stars))},e.isStarred=function(t){return e.hasStorage&&null!==localStorage.getItem("item-"+t)?!0:!1}}]),goingToMoon.controller("ItemDetailsCtrl",["$scope","$firebase","$routeParams","$timeout",function(e,t,i,a){e.invalid="",e.itemId=i.itemId,e.allowAddComment=!0;var o=new Firebase("https://crackling-fire-2235.firebaseio.com/itemDetails/"+e.itemId);o.once("value",function(t){t&&a(function(){e.name=t.val().name,e.description=t.val().description,e.price=t.val().price,e.images=t.val().images,e.comments=t.val().comments,e.setImage(e.images[0]),e.data=t.val()})},function(e){console.log("The read failed: "+e.code)}),e.setImage=function(t){e.mainImage=t},e.addComment=function(t){if(e.newComment.$invalid&&(e.invalid="invalid"),e.newComment.author.$invalid&&(e.invalid="invalid"),e.newComment.$valid){o.child("comments").push({author:t.author,comment:t.comment,timestamp:Firebase.ServerValue.TIMESTAMP}),e.allowAddComment=!1;var i=new Firebase("https://crackling-fire-2235.firebaseio.com/items/"+e.itemId+"/stats/comments");i.once("value",function(e){if(e){var t=e.val();i.set(++t)}})}}}]),goingToMoon.controller("contactCtrl",["$scope","$firebase",function(e){e.sendFeedback=function(t){if(e.feedback.$valid){var i=new Firebase("https://crackling-fire-2235.firebaseio.com/feedback");i.push({name:t.name,email:t.email,message:t.message,timestamp:Firebase.ServerValue.TIMESTAMP}),$("#feedback").css("opacity","0")}}}]),goingToMoon.directive("animateOnScroll",function(){return{restrict:"A",link:function(e,t){var i=$(window).scrollTop()+$(window).height(),a=$(t).offset().top+$(t).height();$(t).is(".item")&&i>a-100&&$(t).addClass("fadeIn"),$(window).scroll(function(){i=$(window).scrollTop()+$(window).height(),a=$(t).offset().top+$(t).height(),$(t).is(".item")?i>a-100&&$(t).addClass("fadeIn"):i>a+100&&$(t).addClass("fadeIn")})}}}),goingToMoon.directive("scrollOnClick",function(){return{restrict:"A",link:function(e,t,i){var a=i.href;t.on("click",function(){var e=a?$(a):t;$("body").animate({scrollTop:e.offset().top},1e3,"easeOutCubic")})}}}),goingToMoon.directive("gtmComment",function(){return{restrict:"E",template:"<h3>{{comment.author}}<span> {{comment.timestamp | date:'dd/MM, HH:mm'}}</span></h3><p>{{comment.comment}}</p>"}});
