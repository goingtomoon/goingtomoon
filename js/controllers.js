var goingtomoonControllers = angular.module('goingtomoonControllers', []);

goingtomoonControllers.controller('ItemDetailsCtrl', ['$scope', '$http',

	function($scope, $http) {
		// $http.get('items/' + $routeParams.itemName + '.json').success(function(data) {
	 //      	$scope.phone = data;
		// });

		// $scope.item = {
		// 	"id": 1,
		// 	"name": "Item 1",
		// 	"description": "description 1",
		// 	"img": "img/products/1.jpg",
		// 	"stats": {
		// 		"stars": 0,
		// 		"comments": 2,
		// 		"views": 23},
		// 	"tags": ["awsome", "cute", "baby"]
		// }
		$scope.itemName = $routeParams.itemName;
	}
]);