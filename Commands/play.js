const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(`Plays song or playlist ▶️`)
        .addStringOption(option =>
            option.setRequired(true)
            .setName("sdasd")
            .setDescription(`Type name or URL.. ✏️`)),
    execute(client, int){
        int.reply({ content: "KYS" });
    }
}