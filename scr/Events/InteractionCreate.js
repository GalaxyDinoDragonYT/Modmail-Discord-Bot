const { InteractionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const Path = require('path');

module.exports = {
        name: 'interactionCreate',
        async execute(interaction) {
                const client = interaction.client;
                await interaction.deferReply();
                try {

                        if (interaction.type === InteractionType.ApplicationCommand) {
                                if (interaction.channel.type != 1) {

                                        const command = client.commands.get(interaction.commandName);

                                        if (!command) return;

                                        try {
                                                await command.execute(interaction);
                                        } catch (error) {
                                                console.log(error);
                                                await interaction.editReply({
                                                        content: `An error occured.`,
                                                        ephemeral: true
                                                });
                                        }
                                } else {
                                        await interaction.editReply({content: `Commands can't be used in DMs.`, ephemeral: true})
                                }
                        } else if (interaction.isButton()) {
                                const File = require(Path.join("../", "Buttons", interaction.customId))

                                try {
                                        File.execute(interaction)
                                } catch (err) {
                                        console.log(err)
                                        return await interaction.editReply({ content: `An error occured.`, ephemeral: true })
                                }

                        } else {
                                return false
                        }
                } catch (err) {
                        console.log(err)
                        return await interaction.editReply({ content: `An error occured.`, ephemeral: true })
                }
        },
};
