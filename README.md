# nhlplaybyplay2-node
Fetch and Convert NHL Play by Play game data v2

## Purpose
Application built using Node.js that provides the means for accessing, fetching NHL Schedule and Play by Play game data in JSON format and
converting data outputs to CSV.

**Hope your familiar with this…**

2017-2018 NHL Season Schedule -> 
http://live.nhl.com/GameData/SeasonSchedule-20172018.json  
This URL (API) outputs the complete NHL regular season schedule in JSON format

Play by Play for game 2017020001 ->
<strike>http://live.nhl.com/GameData/20172018/2017020001/PlayByPlay.json</strike>  
The following URL (API) used to provide the detailed play-by-play for a specific game... It doesn't work anymore! 

Now will be using this one ->
http://statsapi.web.nhl.com/api/v1/game/2017020001/feed/live  
A richer output with more detailed events and information.  


## Installation
Install the dependencies with the following command:
```
npm install
```

Create a `data` directory:
```
mkdir data
```

*Before using you will need to create a specific directory for the season(s) you will be fetching data for.*
i.e. To fetch data from the 2017-2018 NHL season you need to create the following folder `20172018` under the `data` directory. 

## Usage
**Fetch Play by Play JSON**  
node fetch.js *season* *[game]*

To fetch all games for a specific season:
```
node fetch.js 20172018
```

To fetch a specific game from a specific season
```
node fetch.js 20172018 2017020001
```  
Sample JSON, 2017020001.json  
https://github.com/sfrechette/nhlplaybyplay2-node/blob/master/sample/2017020001.json  

**Convert Play by Play - "Events" to CSV**   
node convert-events.js *season* *[game]*

To convert all games for a specific season:
```
node convert-events.js 20172018
```

To convert a specific game from a specific season
```
node convert-events.js 20172018 2017020001
```  
Sample CSV, 201702001_events.csv  
https://github.com/sfrechette/nhlplaybyplay2-node/blob/master/sample/2017020001_events.csv  
Data dictionary: game_id, away_team_id, away_team_code, away_team_name, home_team_id, home_team_code, home_team_name, event_type,   
event_description, event_id, period, period_type, period_time, period_time_remaining, away_goals, home_goals, coord_x, coord_y   

**Convert Play by Play - "Event Players" to CSV**   
node convert-eventplayers.js *season* *[game]*

To convert all games for a specific season:
```
node convert-eventplayers.js 20172018
```

To convert a specific game from a specific season
```
node convert-eventplayers.js 20172018 2017020001
```  
Sample CSV, 201702001_eventplayers.csv  
https://github.com/sfrechette/nhlplaybyplay2-node/blob/master/sample/2017020001_eventplayers.csv  
Data dictionary: game_id, event_id, event_type, player_id, player_name, player_type  

**Convert Play by Play - "Players" to CSV**   
node convert-players.js *season* *[game]*

To convert all games for a specific season:
```
node convert-players.js 20172018
```

To convert a specific game from a specific season
```
node convert-players.js 20172018 2017020001
```  
Sample CSV, 201702001_players.csv  
https://github.com/sfrechette/nhlplaybyplay2-node/blob/master/sample/2017020001_players.csv  
Data dictionary: game_id, player_id, full_name, first_name, last_name, current_number, birth_date, current_age,  
birth_city, birth_state_province, birth_country, nationality, height, weight, active, alternate_captain,  
captain, rookie, shoots_catches, roster_status, current_team, position_type, position   

