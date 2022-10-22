const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const { ClientID, GuildID, LogChannel } = require('../Config.json');

const Cooldowns = new Map();
const CommandCooldown = 60; //Seconds

module.exports = {
    public: false,
    data: new SlashCommandBuilder()
        .setName('messageticket')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('message')
                .setDescription('How would you like to reply?')
                .setRequired(true)
                )
        .setDescription('Reply to a ticket.'),
    async execute(interaction) {
        try {
            if (interaction.channel.isThread()) {
                const Thread = interaction.channel
                const Pinned = await Thread.messages.fetchPinned()
                const FirstPin = Pinned.first()
                const UserId = FirstPin.content
                const Message = interaction.options.getString('message');
                const User = interaction.guild.members.cache.get(UserId)
                const FormattedMessage = `**:green_circle: Support User: ${interaction.user.username}** \n  >>> ${Message}`

                await User.send(FormattedMessage)
                await interaction.channel.send(FormattedMessage)
                return await interaction.deleteReply()
            } else {
                return await interaction.editReply("Command can only be used in threads.")
            }
        } catch (err) {
            console.log(err)
            return await interaction.editReply({ content: "Something went wrong.", ephemeral: true })
        }
    },
};
