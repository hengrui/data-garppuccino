select count(*), 'artists' from spotify_artist union select count(*),
'albums' from spotify_album union select count(*),
'tracks' from spotify_track;