const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const { ClientID, GuildID, LogChannel } = require('../Config.json');

module.exports = {
    name: 'CloseTicket',
    async execute(interaction) {

        try {
            const Message = interaction.message

            const Log_Channel = interaction.client.channels.cache.get(LogChannel);
            const Thread = interaction.channel
            const Pinned = await Thread.messages.fetchPinned()
            const FirstPin = Pinned.first()
            const UserId = FirstPin.content
            const User = interaction.guild.members.cache.get(UserId)

            const Row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Archived")
                        .setCustomId("null")
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(true)
                )

            const Embed = new EmbedBuilder()
                .setColor(Colors.Grey)
                .setTitle('Thread Archived')
                .setAuthor({ name: `${interaction.member.user.username}` })
                .addFields(
                    { name: "Thread", value: Thread.name },
                    { name: "Channel", value: `<#${interaction.channel.id}>` }
                )
                .setTimestamp()
                .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.avatarURL() })
            
            const CloseEmbed = new EmbedBuilder() 
                    .setColor(Colors.Red)
                    .setTitle('Ticket Closed')
                    .setAuthor({name: `${interaction.member.user.username}`})
                    .setDescription("Your ticket has been closed. Please contact us again if you have any questions!")
                    .setTimestamp()
                    .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.avatarURL() })

            await Message.edit({ embeds: Message.embeds, components: [Row] })
            await interaction.deleteReply();
            await Log_Channel.send({ embeds: [Embed] })
            await User.send({embeds: [CloseEmbed]})
            await Thread.setLocked(true);
            return Thread.delete();
        } catch (err) {
            console.log(err)
            return await interaction.editReply({ content: "Button failed.", ephemeral: true })
        }
    },
};