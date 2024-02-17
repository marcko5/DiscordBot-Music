const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Shows my invite link 🎉")

const help = {
    section: "About Me 🕵🏻",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description}!`
};

function process(client, int){
    int.editReply({ embeds: [getBasicEmbed(client, "success", "(🎉) Invite", `If you want to add me: [CLICK HERE](https://discord.com/api/oauth2/authorize?client_id=1189504154121543691&permissions=693640710464&scope=bot)`)] });
}

module.exports = {
    command,
    help,
    process
}