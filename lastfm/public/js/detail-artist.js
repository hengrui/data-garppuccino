var app = app || angular.module('lastfm-crawl');

app.controller('DetailArtistCtrl', function($scope, $stateParams,$sce,Artists){
	var params = {};
	$stateParams.mbid && (params.mbid = $stateParams.mbid);
	$stateParams.artist && (params.artist = $stateParams.artist);

	Artists.get(params, function(res){
			console.log(res);
			if (res.error == null) {
				var artist = $scope.artist = res.artist;

				Artists.getTracks({mbid:artist.mbid}, function(res){

					if (res.error == null) {
						var tracks = $scope.artist.tracks = res.toptracks.track;
						console.log(tracks);
					}
				});

				Artists.getAlbums({mbid:artist.mbid}, function(res){

					if (res.error == null) {
						var albums = $scope.artist.albums = res.topalbums.album;
						console.log(albums);
					}
				});
			}
	});
});

app.config(function($stateProvider, $urlRouterProvider) {    

    $stateProvider
        .state('detail-artist', {
        	url: '/artist/:mbid',
        	templateUrl: 'partial/detail-artist.html',
        	controller: 'DetailArtistCtrl'
        })
                
});