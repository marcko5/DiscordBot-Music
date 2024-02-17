const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Shows info about this project 🛠️")

const help = {
    section: "About Me 🕵🏻",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description}!`
};

function process(client, int){
    int.editReply({ embeds: [getBasicEmbed(client, "success", "(🛠️) GitHub", `Project MARIN: [CLICK HERE](https://github.com/users/marcko5/projects/3)\nProject Marin-Music: [CLICK HERE](https://github.com/marcko5/DiscordBot-Music)`)] });
}

module.exports = {
    command,
    help,
    process
}