const path = require('path');
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const data = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Shows info about author 🛡️")

function execute(client, int){
    int.editReply({ embeds: [getBasicEmbed(client, "success", "(🛡️) Author", `My author is czmarin!\n\nHis steam: [CLICK HERE](https://steamcommunity.com/id/m-a-r-i-n/)\nHis GitHub: [CLICK HERE](https://github.com/marcko5)\nHis YouTube: [CLICK HERE](https://www.youtube.com/channel/UCNCFa6IeWdlr9-UN6nOq5nQ)`)] });
}

module.exports = {
    data,
    execute
}