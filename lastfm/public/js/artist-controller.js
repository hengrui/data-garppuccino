var app = angular.module('lastfm-crawl', ['ui.router', 'ngResource']);

app.factory('Artists', ['$resource', function($resource) {
return $resource('/lastfm', null,
    {
    	'query': {method: 'GET', params:{method:'artist.search'}},
    	'get':{method:'GET', params:{method:'artist.getInfo'}}
    });
}]);

app.controller('ArtistCtrl', function($scope, Artists){
	$scope.query = "jack";
	$scope.artists = [];
	
	$scope.search = function(name) {
		Artists.query({artist:name}, function(result){
			console.log(result);
			if (result.lfm.$.status === "ok") {
				var artistMatches = result.lfm.results[0].artistmatches[0].artist;
				$scope.artists = artistMatches;
				console.log($scope.artists[0]);
			}

		});
	}

	
});

app.controller('AlbumCtrl', function($scope){
	$scope.albums = [
	{
		name: 'one', profile: 'two'
	},
	{
		name: 'one', profile: 'two'
	}

	];
});

app.config(function($stateProvider, $urlRouterProvider) {    
    $urlRouterProvider.otherwise('/artists');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('artists', {
            url: '/artists',
            templateUrl: 'partial/list-artists.html',
            controller: 'ArtistCtrl'
        })
        .state('albums', {
        	url: '/albums',
        	templateUrl: 'partial/list-albums.html',
        	controller: 'AlbumCtrl'
        })
                
});