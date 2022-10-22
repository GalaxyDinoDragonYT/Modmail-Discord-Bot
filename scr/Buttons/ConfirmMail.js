const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, GuildDefaultMessageNotifications, ThreadAutoArchiveDuration } = require('discord.js');
const { ClientID, GuildID, LogChannel, ModMailChannel } = require('../Config.json');

module.exports = {
    name: 'ConfirmMail',
    async execute(interaction) {

        try {
            const Message = interaction.message
            const embed = interaction.message.embeds[0]
            const User = interaction.user
            const Reply = embed.fields[0]

            const Logs_Channel = interaction.client.channels.cache.get(LogChannel);
            const ModMail_Channel = interaction.client.channels.cache.get(ModMailChannel);

            const Row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("null")
                        .setLabel("Success")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true),
                )

            const Embed = new EmbedBuilder()
                .setColor(Colors.Grey)
                .setTitle('New ModMail Created')
                .setAuthor({ name: `${embed.author.name}` })
                .addFields(
                    { name: "ID", value: User.id }
                )
                .setTimestamp()
                .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.avatarURL() })

            const Embed2 = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle('ModMail Created')
                .setAuthor({ name: `${embed.author.name}` })
                .setDescription("You've successfully created a ModMail ticket, please be wait while our staff reply.")
                .setTimestamp()
                .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.avatarURL() })

            const thread = await ModMail_Channel.threads.create({
                name: User.username,
                autoArchiveDuration: 60,
                reason: User.id,
            });

            const Row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("CloseTicket")
                        .setLabel("Close")
                        .setStyle(ButtonStyle.Danger)
                )

            const Msg = await thread.send({content: interaction.user.id,  embeds: Message.embeds, components: [Row2] })
            Msg.pin()

            await thread.send(`:red_circle: **User: ${interaction.user.username}** \n >>> ${Reply.value}`)
            await Message.edit({ embeds: Message.embeds, components: [Row] })
            await Logs_Channel.send({ embeds: [Embed] })
            await User.send({ embeds: [Embed2] });

            return await interaction.deleteReply()
        } catch (err) {
            console.log(err)
            return await interaction.editReply({ content: "Button failed.", ephemeral: true })
        }
    },
};
