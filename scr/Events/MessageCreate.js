const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors } = require('discord.js')
const { ClientID, GuildID, LogChannel, ModMailChannel, TicketButtonTimeout } = require('../Config.json');
const Path = require('path');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        try {
            const ChannelType = message.channel.type;
            const ModMail_Channel = message.client.channels.cache.get(ModMailChannel);
            const ExistingThread = ModMail_Channel.threads.cache.find(x => x.name === message.author.username);

            if (ChannelType == 1 && message.author.id !== message.client.user.id && ExistingThread === undefined) {
                const Embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle('ModMail Ticket')
                    .setAuthor({
                        name: `${message.author.username}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .addFields(
                        { name: "Question", value: message.content }
                    )
                    .setDescription(`Are you sure you want to create a ticket? Times out in ${TicketButtonTimeout} seconds.`)
                    .setFooter({ text: message.client.user.username, iconURL: message.client.user.avatarURL() })
                    .setTimestamp()

                const Row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Create Ticket")
                            .setCustomId("ConfirmMail")
                            .setStyle(ButtonStyle.Primary)
                    )

                const Msg = await message.reply({ embeds: [Embed], components: [Row] })

                setTimeout(async function() {
                    const Button1 = Msg.components[0].components[0]

                    if (Button1.style !== ButtonStyle.Success) {
                        return await Msg.delete()
                    } else {
                        return
                    }
                }, TicketButtonTimeout * 1000)
            } else if (ExistingThread && ChannelType == 1) {
                const FormattedMessage = `:red_circle: **User: ${message.author.username}** \n >>> ${message.content}`
                await ExistingThread.send(FormattedMessage)
                return await message.author.send({content: "Sent response.", ephemeral: true})
            } else {
                return 
            }
        } catch (err) {
            return console.log(err)
        }
    },
};
