// eslint-disable-next-line no-unused-vars
const { Interaction } = require('discord.js');
const DBUser = require('../classes/User');

module.exports = {
    name: 'interactionCreate',
    once: false,
    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        let userData = await DBUser.findOne({ id: interaction.user.id });
        if (!userData) userData = new DBUser({ id: interaction.user.id }); await userData.save();

        try {
            await command.execute(interaction, userData);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};