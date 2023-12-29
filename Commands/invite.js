const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const data = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Shows my invite link 🎉")

function execute(client, int){
    int.editReply({ embeds: [getBasicEmbed(client, "success", "(🎉) Invite", `If you want to add me: [CLICK HERE](https://discord.com/api/oauth2/authorize?client_id=1189504154121543691&permissions=8&scope=bot )`)] });
}

module.exports = {
    data,
    execute
}