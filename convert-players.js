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
    var cmd =  `jq -r --arg season ${season} --arg gameid ${game} '.gameData.players[]? | . as $p |  
                    [$gameid | tonumber] + [$p.id, $p.fullName, $p.firstName, $p.lastName, $p.primaryNumber, $p.birthDate, $p.currentAge,
                    $p.birthCity, $p.birthStateProvince, $p.birthCountry, $p.nationality, $p.height, $p.weight, $p.active, $p.alternateCaptain,
                    $p.captain, $p.rookie, $p.shootsCatches, $p.rosterStatus, $p.currentTeam.triCode, $p.primaryPosition.type, $p.primaryPosition.abbreviation] | 
                    @csv' ./data/${season}/${game}.json > ./data/${season}/${game}_players.csv`;     
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
                var cmd =   `jq -r --arg season ${season} --arg gameid ${game} '.gameData.players[]? | . as $p |  
                                [$gameid | tonumber] + [$p.id, $p.fullName, $p.firstName, $p.lastName, $p.primaryNumber, $p.birthDate, $p.currentAge,
                                $p.birthCity, $p.birthStateProvince, $p.birthCountry, $p.nationality, $p.height, $p.weight, $p.active, $p.alternateCaptain,
                                $p.captain, $p.rookie, $p.shootsCatches, $p.rosterStatus, $p.currentTeam.triCode, $p.primaryPosition.type, $p.primaryPosition.abbreviation] | 
                                @csv' ./data/${season}/${game}.json > ./data/${season}/${game}_players.csv`;       
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