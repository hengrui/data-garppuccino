-- create tables for discogs

create table if not exists  discogs_release (  
rid int PRIMARY KEY, 
styles varchar(255),                    
videos text,   
series varchar(20),   
labels text,           
community text,      
year char(4),      
images text,             
format_quantity varchar(255), 
genres varchar(255),                  
thumb varchar(255),   
extraartists text,         
title varchar(255),
artists text, 
data_changed varchar(255), 
master_id int, 
tracklist text,
status varchar(255), 
released_formatted varchar(255), 
estimated_weight varchar(255),
released varchar(64),
date_added varchar(64),
country varchar(255),
notes text,
identifiers text,
companies text,
uri varchar(255),
formats text,
resource_url varchar(255),
data_quality varchar(255)
);

create table if not exists discogs_artist (
aid int PRIMARY KEY,
profile text,
urls text,
release_url varchar(255),
name varchar(255),
uri varchar(255),
images text,
data_quality varchar(255),
realname varchar(255),
groups text,
aliases text,
namevariations text,
release_id int
);

create table if not exists discogs_track (
tid SERIAL PRIMARY KEY,
duration varchar(20),
position varchar(3),
type_ varchar(100),
titile varchar(255),
release_id int
);

