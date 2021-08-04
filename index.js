const GlobToRegex = require('glob-to-regexp')
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
  client.user.setPresence({ activity: { name: '!raidclean help', type: 'COMPETING' }, status: 'online' })
});

// track progress of guilds currently being cleaned up
let cleanupInProgress = [];

function removeChannels(message, guildid, matchfn) {
  if (cleanupInProgress.includes(guildid)) {
    message.reply("Sorry, I'm already cleaning this guild.");
    return;
  }
  cleanupInProgress.push(guildid)
  let count = 0;
  let guild = client.guilds.resolve(guildid);
  //message.reply("Starting deleting");
  guild.channels.cache.forEach((id, c) => {
    let channel = guild.channels.resolve(id);
    console.log(channel.name)
    if (!matchfn(channel)) return;
    console.log('\\> deleting this channel')
    channel.delete();
    count++;
  });
  message.reply(`Deleted ${count} channels`)
}

function advancedCmdExec(message) {
  if (false) {//!message.guild) {
    message.reply("Sorry, I don't work in DMs yet. But the owner has an idea on how to!");
    return;
  }
  let params = message.content.split(' ');
  let cmd = message.guild ? params[1] : params[2];
  let guildid = message.guild ? message.guild.id : params[1];
  if (cmd == 'help') {
    message.reply(`
Available commands:
\`!raidclean!\` - simple command to remove all channels named "hacked"
\`!raidclean help\` - display this message
\`!raidclean matchexactname <name>\` - delete all channels which have the name <name>
\`!raidclean matchglob <name>\` - like matchexactname, but * means zero or more of any character (glob matching)
`)
    if (!message.guild) {
      message.reply(`
I see that you have DMed me. If you need (or want) to run commands from a DM, add the server ID that you want to clean after the first element of a command. Examples (where 1234567890 is the server ID):
\`!raidclean! 1234567890\`
\`!raidclean 1234567890 matchexactname hacked\`
You can get the server ID by enabling User Settings -> (under App Settings) Advanced -> Developer Mode, and then right click the needed server in the server list and click Copy ID.
        `)
    }
  }
  else if (cmd == 'matchexactname') {
    let matchname = params.slice(message.guild? 2 : 3).join(' ');
    message.reply(`Will delete channels that have the name \`${matchname}\``)
    removeChannels(message, guildid, x => x.name == matchname);    
  } else if (cmd == 'matchglob') {
    let glob = params.slice(message.guild? 2 : 3).join(' ');
    let re = GlobToRegex(glob);
    message.reply(`Will delete channels that match glob \`${glob}\``)
    console.log(re)
    removeChannels(message, guildid, x => re.test(x.name));
  } else {
    message.reply("This command does not exist, or is not implemented yet.");
  }
}

client.on('message', message => {
  try {
    if (message.content == "!raidclean!") {
      removeChannels(message, x => x.name == "hacked")
    } else if (message.content.startsWith("!raidclean ")) {
      advancedCmdExec(message);
    }
  } catch (e) {
    try {message.reply("Sorry, an error occurred. Please try again later.")}
    finally {console.error(e)}
  }
});

client.login(process.env.TOKEN);
