#Crawler using Discorgs API (disconnect)

##crawler.js
Three argvs is needed for this function in such form:
node crawler.js method start end
-method, one of 'release', 'label', 'artist', 'master'
-start, a number indicates the searching starting point
-end, a number indicates the ending point

##crawler_methods.js
Contains four types of crawling methods

##myData.json
Json file stores data retrieved from discorgs API

##restore.js
read JSON file and restore data into database
Here we use postgreSQL

##testPG.js
just some codes to test the postgreSQL interface

##unfoundIDs.txt
IDs used for retrieving are iterated so that some of them might fail

##crawler_to_line.js, readline.js
Call 'node crawler_to_line.js | node readline.js' to receive data from command line
