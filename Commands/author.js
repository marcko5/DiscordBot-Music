const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Shows info about author 🛡️")

const help = {
    section: "About Me 🕵🏻",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description}!`
};


function process(client, int){
    int.editReply({ embeds: [getBasicEmbed(client, "success", "(🛡️) Author", `My author is czmarin!\n\nHis steam: [CLICK HERE](https://steamcommunity.com/id/m-a-r-i-n/)\nHis GitHub: [CLICK HERE](https://github.com/marcko5)\nHis YouTube: [CLICK HERE](https://www.youtube.com/channel/UCNCFa6IeWdlr9-UN6nOq5nQ)`)] });
}

module.exports = {
    command,
    help,
    process
}