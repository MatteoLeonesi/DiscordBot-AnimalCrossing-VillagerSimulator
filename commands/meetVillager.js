const { request } = require('undici');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
let cooldown = new Set();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meetvillagers')
        .setDescription('speak with a villager'),
    async execute(interaction) {
        const villagerFound = Math.floor(Math.random() * 414);
        const villager = await request(`https://acnhapi.com/v1/villagers/${villagerFound}`);
        const { image_uri, name, icon_uri, species, gender, birthday } = await getJSONResponse(villager.body);
        //acccess catch-phrase
        const Accessdescription = await request(`https://acnhapi.com/v1/villagers/${villagerFound}`);
        const description = await getJSONResponse(Accessdescription.body);
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(name['name-USen'])
            .setDescription(`${description['catch-phrase']} !`)
            .setThumbnail(icon_uri)
            .addFields(
                { name: 'Species', value: `${species}`, inline: true },
                { name: 'Gender', value: `${gender}`, inline: true },
                { name: 'Birthday', value: `${birthday}`, inline: true },
            )
            .setImage(image_uri)
            .setFooter({ text: name['name-JPja'] });
        interaction.reply({ embeds: [exampleEmbed] });
    },
};

async function getJSONResponse(body) {
    let fullBody = '';
    for await (const data of body) {
        fullBody += data.toString();
    }
    return JSON.parse(fullBody);
}
