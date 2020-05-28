var async = require('async');
var request = require('request');
var jsonfile = require('jsonfile');
var colors = require('colors/safe');


var param2 = process.argv[2];
var param3 = process.argv[3];

const season = param2;
const game = param3;

// Additional parameter indicates individual game to fetch
if (process.argv[3] != null) {
    //const URL = `http://live.nhl.com/GameData/${season}/${game}/PlayByPlay.json`;
    const URL = `http://statsapi.web.nhl.com/api/v1/game/${game}/feed/live`;
    request(URL, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            console.log(red(`Failed to fetch GameID: ${game}`));
            return;
        }    
        var importedJSON = JSON.parse(body);
        writeFileSync(`data/${season}/${game}.json`, importedJSON);
        console.log(green(`Fetching URL: ${URL}`));
        console.log(green('Game fetched successfully'));
    })
} else {
    // Entire season fetch - First: fetch and save JSON season schedule 
    request(`http://live.nhl.com/GameData/SeasonSchedule-${season}.json`, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            console.log(red(`Failed to get schedule for season ${season}`));
            return;
        }
        var importedJSON = JSON.parse(body);
        writeFileSync(`data/${season}/schedule-${season}.json`, importedJSON);
        console.log(green(`Schedule for season ${season} processed successfully`));

        // Today's date
        var utcDate = new Date().toJSON().slice(0,10);
        utcDate = utcDate.replace(/-/g,'');

        // Second: fetch and save each JSON play by play games from season schedule
        let lastProcessedId;
        eachSeries(importedJSON, function (row, callback) {
            const gameId = row.id;
            const gameDate = row.est;
            //const URL = `http://live.nhl.com/GameData/${season}/${gameId}/PlayByPlay.json`;
            const URL = `http://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`;
            
            lastProcessedId = gameId

            request(URL, function (error, response, body) {
                if (error) {
                    callback(error);
                } else {
                // catch exceptions from either writeFileSync or JSON.parse
                try {
                // If today's date 'utdDate' is smaller than 'gameDate', game not played yet! Then exit
                    if ((utcDate - 1) < gameDate.substring(0, 8)) {
                        console.log(green('All available games fetched successfully'));
                        return;
                    } else {
                        console.log(green(`Fetching URL: ${URL}`));
                        writeFileSync(`data/${season}/${gameId}.json`, JSON.parse(body));
                        callback();
                    }
                } catch (err) {
                    console.log(red(`Failed to fetch GameID: ${gameId}`));
                    // this will stop processing
                    callback(err);
                }
                }
            })
        }, function (err) { 
            // if any of the file processing produced an error, err would equal that error
            if (err) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.log(red(`Last attempted GameID: ${lastProcessedId}`));
                console.log('detailed error:', err);
                return;
            } else {
                console.log(green('All available games fetched successfully'));
            }
        }) 
    })
}