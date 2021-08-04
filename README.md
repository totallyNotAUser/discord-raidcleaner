# discord-raidcleaner
Discord bot that helps clean your Discord server after being raided.

Add the official instance: https://discord.com/api/oauth2/authorize?client_id=872197585832652800&permissions=8&scope=bot (might be more up to date than source, but only max by a couple of hours; might be offline, if it is, message totallyNotAUser#6570 on discord or [totallynotauser@blah.im](xmpp:totallynotauser@blah.im) on xmpp)
## Setup
1. Clone the repo
2. In the repo folder run: `npm install discord.js glob-to-regexp`
## Running
Set the environment variable `TOKEN` to your bot's token.

Alternatively, replace the last line in index.js with `client.login("YOURBOTTOKEN")`
