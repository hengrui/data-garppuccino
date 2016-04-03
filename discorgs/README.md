#Crawler using Discorgs API (disconnect)

##crawler.js
Crawler using Discorgs API

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
