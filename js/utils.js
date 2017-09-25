(function(){
	angular.module('ventura.Utils', [])
	
		.factory('$v.Math', [function(){
			function randomRange(min, max){				
				return Math.floor(Math.random() * (max - min + 1) + min);
			}
			
			return{
				randomRange:randomRange	
			};
		}]);
})();