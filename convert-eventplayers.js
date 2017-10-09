var fs = require('fs');
var path = require('path');
var async = require('async');
var colors = require('colors/safe');
var param2 = process.argv[2];
var param3 = process.argv[3];

const season = param2;
const game = param3;
const dataFolder = `./data/${season}/`;

// Additional parameter indicates individual game to convert (parse) from json to csv
if (process.argv[3] != null) {
    var exec = require('child_process').exec;
    var cmd =  `jq -r --arg season ${season} --arg gameid ${game} '.liveData.plays.allPlays[]? | . as $e | $e.players[]? | . as $p | 
                    [$gameid | tonumber] + [$e.about.eventIdx, $e.result.event, $p.player.id, $p.player.fullName, $p.playerType] | 
                    @csv' ./data/${season}/${game}.json > ./data/${season}/${game}_eventplayers.csv`;
    exec(cmd, function (error, stdout, stderr) {  
        if (error) {
            console.log(colors.red(`exec error: ${error}`));
            return;
        } else {
            console.log(colors.green(`Converted ${game}.json to ${game}.csv successfully`));
        }
    })
} else {
    fs.readdir(dataFolder, (err, files) => {
        if (err) {
            console.log(colors.red(`exec error: ${err}`));
        } else {
            files = files.filter(item => !(/^(.*\.(?!(json)$))?[^.]*$/i).test(item)); // Read only *.json files
            files = files.filter(item => !(/^.*schedule.*$/i).test(item)); // Remove, filter out *schedule* file 

            async.eachSeries(files, (file, done) => {
                //console.log(file)
                var game =  path.parse(file).name; 
                var exec = require('child_process').exec;
                var cmd =  `jq -r --arg season ${season} --arg gameid ${game} '.liveData.plays.allPlays[]? | . as $e | $e.players[]? | . as $p | 
                                [$gameid | tonumber] + [$e.about.eventIdx, $e.result.event, $p.player.id, $p.player.fullName, $p.playerType] | 
                                @csv' ./data/${season}/${game}.json > ./data/${season}/${game}_eventplayers.csv`;            
                exec(cmd, function (error, stdout, stderr) {
                    if (error) {
                        console.log(colors.red(`exec error: ${error}`));
                    } else {
                        console.log(colors.green(`Converted ${game}.json to ${game}.csv successfully`));
                    }
                    // Must call the done callback to signify this iteration os done
                    done(error);

                })
            }, () => {
                //console.log('Now the whole collection is done!');
            })
        }
    })
}