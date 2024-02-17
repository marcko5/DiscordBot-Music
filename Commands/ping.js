const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed } = require("../embedCreator.js");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Shows my ping 📊")

const help = {
    section: "Info 📢",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description}!\n\nREQUIREMENT: Internet connection! (OPTIONAL)`
};

async function process(client, int){
    var ping = await client.ws.ping;
    var state = "";
    if (ping < 50)
        state = "success";
    else if (ping < 100)
        state = "warning";
    else
        state = "error";
    await int.editReply({ embeds: [getBasicEmbed(client, state, "(📊) Ping", `My ping is \`${ping}\` ms!`)] });
}

module.exports = {
    command,
    help,
    process
}