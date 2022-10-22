const { ActivityType } = require("discord.js");
const Path = require("node:path")

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Bot booted! Bot user is ${client.user.tag} \n\nErrors and debug: \n\n`);
		client.user.setPresence({ activities: [{ name: `Support`, type: ActivityType.Playing }], status: 'online' });
	},
};
