# Crazybot
Crazybot is a general discord bot that is capable of operating a discord server.

This is my very first Javascript project so giving me any type of feedback would be extremely helpful.


## Get the bot

If you just want to get the bot on your server, invite it from here [Invite link](https://top.gg/bot/799752849163550721) or join my discord server [Discord server](https://discord.gg/vSFp7SjHWp)

## Beofre you fork
you need a mongoDB cluster for the bot to store per-server settings, points and other data. Create a mongoDB cluster and paste the connnection link inside the .env file under the variable "MONGO_PATH"

If you want to turn on this bot, follow there steps:
1. Install node.js v16 and higher and discord.js V13
3. Copy the repository
4. Creat a .env file with the following variables: `DISCORD_BOT_TOKEN` = (discord token), `MONGO_PATH` = (mongoDB cluster connection link), `NBLXJS_COOKIE` = a cookie of an unused Roblox account for the roblox features.
5. Add `TRELLO_KEY` and `TRELLO_TOKEN` variables to the .env file and fill them with the Trello api key/token. (Required for BGC module and ;blacklists command)
6. Launch the bot using node ./index.js
7. In the config/config.json file, change the author id to your discord id, so you can access the ;eval command.


## Helpful tips for those trying to read my code 
* The /functions folder includes a lot of important and often-repeated functions across the bot
* All of the event handling happens in the /event_listeners folder
* The bot is not very modular, so if you try to modify/delete some stuff, make sure to search globally for that stuff to make sure the bot doesn't break completely.
* There is a hidden folder called `Private_JSON_files` that houses 2 JSON files: `raiderGroupsHistory.json` and `TSU_careers.json`. Both of these should be set to an empty object `{}` at the start, as they do get filled by the rank logs module automatically.

