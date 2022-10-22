const Secrets = require('./Modules/Secrets.js');
const { Client, GatewayIntentBits, Collection, ActivityType, Partials } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Token = Secrets.Token;
const Mongo = Secrets.Mongo;
const Mongoose = require('mongoose')
const fs = require('fs');
const Path = require('path');
const { ClientID, GuildID } = require('./Config.json');
const CommandDir = Path.join(__dirname, 'Commands')
const PublicCommands = [];
const GuildCommands = [];
const commandFiles = fs.readdirSync(CommandDir).filter(file => file.endsWith('.js'));
const eventsPath = Path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildInvites, GatewayIntentBits.DirectMessages], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });
client.commands = []
client.commands = new Collection();

client.help = []
client.help = new Collection();

for (const file of commandFiles) {
  const command = require(`${CommandDir}/${file}`);
  if (command.public === true) {
    PublicCommands.push(command.data.toJSON());
    client.commands.set(command.data.name, command)
    client.help.set(command.data.name, command.data.description)
    console.log(`Loaded public command ${file}`)
  } else {
    GuildCommands.push(command.data.toJSON());
    client.commands.set(command.data.name, command)
    console.log(`Loaded private command ${file}`)
  }

}

for (const file of eventFiles) {
  const FilePath = Path.join(eventsPath, file);
  const Event = require(FilePath);
  console.log(`Loaded event ${file}`)
  if (Event.once) {
    try {
      client.once(Event.name, (...args) => Event.execute(...args));
    } catch (err) {
      return console.log(err)
    }
  } else {
    try {
      client.on(Event.name, (...args) => Event.execute(...args));
    } catch (err) {
      return console.log(err)
    }
  }
}

const rest = new REST({ version: '9' }).setToken(Token);

(async () => {
  try {
    console.log('\nStarted refreshing slash commands.');

    await rest.put(
      Routes.applicationGuildCommands(ClientID, GuildID),
      { body: GuildCommands },
    );

    await rest.put(
      Routes.applicationCommands(ClientID),
      { body: PublicCommands },
    );

    console.log('Successfully reloaded slash commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.login(Token);