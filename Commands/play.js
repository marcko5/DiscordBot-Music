const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { getBasicEmbed, getDistubeEmbed } = require("../embedCreator.js");
const { SearchResultType } = require("distube");
const fs = require("fs");

const command = new SlashCommandBuilder()
.setName(path.basename(__filename).replace(".js", ""))
.setDescription("Plays song or playlist ▶️")
.addStringOption(option =>
    option.setName("media")
    .setDescription("Type name or URL.. ✏️")
    .setRequired(true))
.addIntegerOption(option =>
    option.setName("limit")
    .setDescription("Type limit for searching.. ✏️")
    .setRequired(false)
    .setMinValue(3)
    .setMaxValue(30))
.addStringOption(option => 
    option.setName("type")
    .setDescription("Type video or playlist.. ✏️")
    .setRequired(false)
    .addChoices(
        { name: "video", value: "video" },
        { name: "playlist", value: "playlist" }
    ));

const help = {
    section: "Commands 💬",
    description: command.description,
    message: `Section: \`${path.basename(__filename).replace(".js", "")}\`..\n> ${command.description} via arguments:\n> - __media__ can be URL or name! (REQUIRED)\n> - __limit__ is number from 3 to 30, you can search multiple variants of media with this!\n> - __type__ is VIDEO or PLAYLIST, it defines if you want to search video or playlist! (DEFAULT VIDEO)\n\nSEARCH: When you use limit option, you get list of results. You can answer with one number ||(for example 6)|| or as multiple numbers ||(for example 1,3,5)||.\nREQUIREMENT: Queue has to be playing!\nTIP: If you can't find your song, try the search via limit variant!`
};

async function process(client, int){
    if (int.member.voice.channel == null && client.distube.getQueue(int) == undefined)
        int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nYou have to be **joined in voice** to use this command!\n(I have to **be playin** something!)`)] });
    else{
        var voiceChannel;
        if (client.distube.getQueue(int) != undefined)
            voiceChannel = client.distube.getQueue(int).voiceChannel; 
        else
            voiceChannel = int.member.voice.channel;
        if (!int.options.getInteger("limit")){
            int.editReply({ embeds: [getBasicEmbed(client, "random", "(🔎) Searching", `You wanted to search: ${int.options.getString("media")}`)] });
            client.distube.play(voiceChannel, int.options.getString("media"), { member: int.member, textChannel: int.channel });
        }
        else{
            var cache = JSON.parse(fs.readFileSync("Configs/cache.json", "utf-8"));
            if (int.guild.id.toString() in cache)
                if (int.member.id.toString() in cache[int.guild.id])
                    return int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nYou have an **on going search** request!`)] });
            const limit = int.options.getInteger("limit");
            if (int.options.getString("type") == "playlist"){
                const result = await client.distube.search(int.options.getString("media"), { limit: limit, type: SearchResultType.PLAYLIST }).catch(async (err) => {
                    await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nSomething happened..\nTry again later!`)] });
                    return console.log(`!ERROR! Unknown DisTube\n${err}\n`);
                });
                await int.editReply({ embeds: [getDistubeEmbed(client, "searchResultList", int, result)] });
                var cache = JSON.parse(fs.readFileSync("Configs/cache.json", "utf-8"));
                if (!cache[int.guild.id])
                    cache[int.guild.id] = {
                        guild: int.guild.name
                    };
                cache[int.guild.id][int.member.id] = {
                    result: result
                }
                fs.writeFileSync("Configs/cache.json", JSON.stringify(cache, null, 2), "utf-8");
                setTimeout(() => {
                    cache = JSON.parse(fs.readFileSync("Configs/cache.json", "utf-8"));
                    if (cache[int.guild.id]){
                        if (cache[int.guild.id][int.member.id]){
                            delete cache[int.guild.id][int.member.id];
                            fs.writeFileSync("Configs/cache.json", JSON.stringify(cache, null, 2), "utf-8");
                            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nYou have not **answered search** request!\n(Request **was** terminated!)`)] });
                        }
                    }

                }, 30000);
            }
            else{
                const result = await client.distube.search(int.options.getString("media"), { limit: limit, type: SearchResultType.VIDEO }).catch(async (err) => {
                    await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nSomething happened..\nTry again later!`)] });
                    return console.log(`!ERROR! Unknown DisTube\n${err}\n`);
                });
                await int.editReply({ embeds: [getDistubeEmbed(client, "searchResultSong", int, result)], ephemeral: false });
                var cache = JSON.parse(fs.readFileSync("Configs/cache.json", "utf-8"));
                if (!cache[int.guild.id])
                    cache[int.guild.id] = {
                        guild: int.guild.name
                    };
                cache[int.guild.id][int.member.id] = {
                    result: result
                }
                fs.writeFileSync("Configs/cache.json", JSON.stringify(cache, null, 2), "utf-8");
                setTimeout(() => {
                    cache = JSON.parse(fs.readFileSync("Configs/cache.json", "utf-8"));
                    if (cache[int.guild.id]){
                        if (cache[int.guild.id][int.member.id]){
                            delete cache[int.guild.id][int.member.id];
                            fs.writeFileSync("Configs/cache.json", JSON.stringify(cache, null, 2), "utf-8");
                            int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${path.basename(__filename).replace(".js", "")}** an error occured..\nYou have not **answered search** request!\n(Request **was** terminated!)`)] });
                        }
                    }

                }, 30000);
            }
        }
    }
}

module.exports = {
    command,
    help,
    process
}