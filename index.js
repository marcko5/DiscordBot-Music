// TODO: FIX ERROR






require("dotenv").config();
const token = process.env.TOKEN;
const clientid = process.env.CLIENTID;
const guildid = process.env.GUILDID;

const fs = require("fs");

const Discord = require("discord.js");
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration] });

const { DisTube } = require("distube");
const { DeezerPlugin } = require("@distube/deezer");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { getBasicEmbed, getDistubeEmbed } = require("./embedCreator");
const distube = new DisTube(client, {
    nsfw: true,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    savePreviousSongs: true,
    plugins: [new DeezerPlugin(), new SpotifyPlugin(), new SoundCloudPlugin(), new YtDlpPlugin({ update: false })]
});
client.distube = distube;

client.on(Events.InteractionCreate, async (int) => {
    if (!int.user.bot && int.isCommand){
        try{
            await int.deferReply();
        }
        catch(err){
            try{
                await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nAnyway, **try again** later!`)] });
            }
            catch{
                await int.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nAnyway, **try again** later!`)] });
            }
            console.log(`!ERROR! While processing ${int.commandName} command\n${err}\n`);
            await saveError(err);
        }
        if (int.commandName == "setup"){
            const command = client.commands.get(int.commandName);
            if (command){
                try{
                    await command.process(client, int);
                }
                catch(err){
                    await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nAnyway, **try again** later!`)] });
                    console.log(`!ERROR! While processing ${int.commandName} command\n${err}\n`);
                    await saveError(err);
                }
            }
        }
        else{
            let rooms = JSON.parse(fs.readFileSync("Configs/rooms.json", "utf-8"));
            if (!(int.guild.id.toString() in rooms)){
                await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nDefault **rooms weren't** prepared!`)] });
                console.log(`!ERROR! While processing ${int.commandName} command\nROOMS_NOT_SET: JSON rooms didn't contain this guild!\n`);
                rooms[int.guild.id] = {
                    errorSent: true
                }
                fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
            }
            else if (int.guild.id.toString() in rooms){
                if (!("command" in rooms[int.guild.id])){
                    await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nDefault room for **commands wasn't** prepared!`)] });
                    if (!rooms[int.guild.id].errorSent){
                        console.log(`!ERROR! While processing ${int.commandName} command\nROOMS_NOT_SET: JSON room with element for command didn't contain this guild!\n`);
                        rooms[int.guild.id].errorSent = true;
                        fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                    } 
                }
                else if (!("info" in rooms[int.guild.id])){
                    await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nDefault room for **info wasn't** prepared!`)] });
                    if (!rooms[int.guild.id].errorSent){
                        console.log(`!ERROR! While processing ${int.commandName} command\nROOMS_NOT_SET: JSON room with element for info didn't contain this guild!\n`);
                        rooms[int.guild.id].errorSent = true;
                        fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                    }
                }
                else{
                    const checkCommand = int.guild.channels.cache.has(rooms[int.guild.id].command);
                    const checkInfo = int.guild.channels.cache.has(rooms[int.guild.id].info);
                    if (!checkCommand){
                        await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nDefault room for **commands wasn't** prepared!`)] });
                        if (!rooms[int.guild.id].errorSent){
                            console.log(`!ERROR! While processing ${int.commandName} command\nROOMS_NOT_SET: JSON room with element for command didn't contain this guild!\n`);
                            rooms[int.guild.id].errorSent = true;
                            fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                        } 
                    }
                    else if (!checkInfo){
                        await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nDefault room for **info wasn't** prepared!`)] });
                        if (!rooms[int.guild.id].errorSent){
                            console.log(`!ERROR! While processing ${int.commandName} command\nROOMS_NOT_SET: JSON room with element for info didn't contain this guild!\n`);
                            rooms[int.guild.id].errorSent = true;
                            fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                        }
                    }
                    else{
                        if (int.channel.id != rooms[int.guild.id].command)
                            await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nYou **typed into wrong** channel!`)] });
                        else{
                            const command = client.commands.get(int.commandName);
                            if (command){
                                try{
                                    await command.process(client, int);
                                }
                                catch(err){
                                    await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nAnyway, **try again** later!`)] });
                                    console.log(`!ERROR! While processing ${int.commandName} command\n${err}\n`);
                                    await saveError(err);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

client.on(Events.MessageCreate, async (msg) => {
    if (!msg.author.bot){
        let cache = JSON.parse(fs.readFileSync("Configs/cache.json", "utf-8"));
        if (msg.content == "cancel" || !msg.content.split(",").some(isNaN)){
            if (msg.guild.id.toString() in cache){
                if (msg.author.id.toString() in cache[msg.guild.id]){
                    let rooms = JSON.parse(fs.readFileSync("Configs/rooms.json", "utf-8"));
                    if (!(msg.guild.id.toString() in rooms)){
                        msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nDefault **rooms weren't** prepared!`)], ephemeral: true });
                        msg.react("❌");
                        console.log(`!ERROR! While processing search request\nROOMS_NOT_SET: JSON rooms didn't contain this guild!\n`);
                        rooms[msg.guild.id] = {
                            errorSent: true
                        }
                        fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                    }
                    else{
                        if (!("command" in rooms[msg.guild.id])){
                            msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nDefault room for **commands wasn't** prepared!`)], ephemeral: true });
                            msg.react("❌");
                            if (!rooms[msg.guild.id].errorSent){
                                console.log(`!ERROR! While processing search request\nROOMS_NOT_SET: JSON room with element for command didn't contain this guild!\n`);
                                rooms[msg.guild.id].errorSent = true;
                                fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                            } 
                        }
                        else if (!("info" in rooms[msg.guild.id])){
                            msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nDefault room for **info wasn't** prepared!`)], ephemeral: true });
                            msg.react("❌");
                            if (!rooms[msg.guild.id].errorSent){
                                console.log(`!ERROR! While processing search request\nROOMS_NOT_SET: JSON room with element for info didn't contain this guild!\n`);
                                rooms[msg.guild.id].errorSent = true;
                                fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                            }
                        }
                        else{
                            const checkCommand = msg.guild.channels.cache.has(rooms[msg.guild.id].command);
                            const checkInfo = msg.guild.channels.cache.has(rooms[msg.guild.id].info);
                            if (!checkCommand){
                                msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nDefault room for **commands wasn't** prepared!`)], ephemeral: true });
                                msg.react("❌");
                                if (!rooms[msg.guild.id].errorSent){
                                    console.log(`!ERROR! While processing search request\nROOMS_NOT_SET: JSON room with element for command didn't contain this guild!\n`);
                                    rooms[msg.guild.id].errorSent = true;
                                    fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                                } 
                            }
                            else if (!checkInfo){
                                msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nDefault room for **info wasn't** prepared!`)], ephemeral: true });
                                msg.react("❌");
                                if (!rooms[msg.guild.id].errorSent){
                                    console.log(`!ERROR! While processing search request\nROOMS_NOT_SET: JSON room with element for info didn't contain this guild!\n`);
                                    rooms[msg.guild.id].errorSent = true;
                                    fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
                                }
                            }
                            else{
                                if (msg.channel.id != rooms[msg.guild.id].command){
                                    msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nYou **typed into wrong** channel!`)], ephemeral: true });
                                    msg.react("❌");
                                }
                                else{
                                    if (msg.content == "cancel"){
                                        delete cache[msg.guild.id][msg.member.id];
                                        fs.writeFileSync("Configs/cache.json", JSON.stringify(cache, null, 2), "utf-8");
                                        msg.reply({ embeds: [getBasicEmbed(client, "error", "(♻️) Canceled", `You searching request was canceled!`)] });
                                        msg.react("♻️");
                                    }
                                    else{
                                        let numbers = msg.content.split(",");
                                        if (numbers.length == 1){
                                            let num = parseInt(msg.content);
                                            if (num < 1 || num > cache[msg.guild.id][msg.author.id].result.length){
                                                msg.reply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **search request** an error occured..\nYou **typed wrong** answer!`)], ephemeral: true });
                                                msg.react("❌");
                                            }
                                            else{
                                                msg.react("✅");
                                                let voiceChannel;
                                                if (client.distube.getQueue(msg) != undefined)
                                                    voiceChannel = client.distube.getQueue(msg).voiceChannel; 
                                                else
                                                    voiceChannel = msg.member.voice.channel;
                                                client.distube.play(voiceChannel, cache[msg.guild.id][msg.member.id].result[num-1], { member: msg.member, textChannel: msg.channel });
                                                //msg.reply({ embeds: [getDistubeEmbed(client, "addSong", distube.getQueue(msg), cache[msg.guild.id][msg.member.id].result[num-1])] })
                                                delete cache[msg.guild.id][msg.member.id];
                                                fs.writeFileSync("Configs/cache.json", JSON.stringify(cache, null, 2), "utf-8");
                                            }
                                        }
                                        else{
                                            const wrong = [];
                                            const correct = [];
                                            for (let i = 0; i < numbers.length; i++){
                                                let num = parseInt(numbers[i]);
                                                if (num < 1 || num > cache[msg.guild.id][msg.author.id].result.length)
                                                    wrong.push(num);
                                                else{
                                                    correct.push(num);
                                                    let voiceChannel;
                                                    if (client.distube.getQueue(msg) != undefined)
                                                        voiceChannel = client.distube.getQueue(msg).voiceChannel; 
                                                    else
                                                        voiceChannel = msg.member.voice.channel;
                                                    await client.distube.play(voiceChannel, cache[msg.guild.id][msg.member.id].result[num-1], { member: msg.member, textChannel: msg.channel });
                                                    //msg.reply({ embeds: [getDistubeEmbed(client, "addSong", distube.getQueue(msg), cache[msg.guild.id][msg.member.id].result[num-1])] })
                                                }
                                            }
                                            if (wrong.length == 0)
                                                msg.react("✅");
                                            else{
                                                if (correct.length == 0)
                                                    msg.react("🤡");
                                                else{
                                                    msg.react("❌");
                                                    await delete cache[msg.guild.id][msg.member.id];
                                                    await fs.writeFileSync("Configs/cache.json", JSON.stringify(cache, null, 2), "utf-8");
                                                }
                                                msg.reply({ embeds: [getBasicEmbed(client, "warning", "(💭) Search Answer", `${correct.length == 0 ? "All" : "Some"} of your answers were \`wrong\`!\n> ✅: ${correct.length == 0 ? "NONE" : correct.join(", ")}\n> ❌: ${wrong.length == 0 ? "NONE" : wrong.join(", ")}`)]})
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

const rest = new REST().setToken(token);
client.commands = new Collection();
async function loadCommands(){
    let errorMessage = "";
    let commands = [];
    for await (const file of fs.readdirSync("Commands").filter((x) => x.endsWith(".js") && !x.startsWith("_") && x != "help.js")){
        const command = require(`./Commands/${file}`);
        if ("command" in command && "help" in command && "process" in command){
            client.commands.set(command.command.name, command);
            commands.push(command.command);
        }
        else{
            if (errorMessage == "")
                errorMessage = `!ERROR! Couldn't found "command" || "help" || "process" in ${file}`;
            else
                errorMessage += `\n!ERROR! Couldn't found "command" || "help" || "process" in ${file}`;
        }
    }
    const help = require("./Commands/help.js");
    if (help){
        client.commands.set(help.command.name, help);
        commands.push(help.command);
    }
    await console.log(`Loading ${fs.readdirSync("Commands").filter((x) => x.endsWith(".js") && !x.startsWith("_")).length} command${(fs.readdirSync("Commands").filter((x) => x.endsWith(".js") && !x.startsWith("_"))?.length || 0) > 1 || (fs.readdirSync("Commands").filter((x) => x.endsWith(".js") && !x.startsWith("_"))?.length || 0) == 0 ? "s" : ""}`);
    const data = await rest.put(Routes.applicationCommands(clientid), { body: commands }).catch((err) => {
        if (errorMessage == "")
            errorMessage = `!ERROR! While loading commands via REST (${err.toString().replace("\n", ", ")})`;
        else
            errorMessage += `\n!ERROR! While loading commands via REST (${err.toString().replace("\n", ", ")})`;
        saveError(err);
    });
    if (errorMessage){
        await console.log(errorMessage);
        await saveError(errorMessage);
    }
    await console.log(`Loaded ${data?.length || 0} command${(data?.length || 0) > 1 || (data?.length || 0) == 0 ? "s" : ""}\n`)
}
function saveError(error){
    try{
        fs.writeFileSync("Configs/global.log", `[${new Date(new Date().getTime())}]\n${error.toString()}`/*${error?.message ? "\n"+error.message : ""}${error?.data ? "\n"+error.data : ""}${error?.response ? "\n"+error.response : ""}*/+`\n\n`, { flag: "a+" });
    }
    catch{
        console.log(`\n\n!!! FATAL ERROR !!!\nCan't write inside ERROR LOG FILE!\nFile /Configs/error.log couldn't be found!\nFile /Configs/error.log couldn't be edited!\n${err}\n\n`);
    }
}
/*async function loadCommands(){
    const commands = [];
    let _help;
    for (const file of fs.readdirSync("./Commands").filter((x) => x.endsWith(".js"))){
        if (file == "help.js"){
            _help = file;
        }
        else{
            const command = require(`./Commands/${file}`);
            if ("data" in command){
                await commands.push(command.data.toJSON());
                await client.commandsInfo.set(command.data.name, command);
            }
        }
    }
    if (_help){
        const command = require(`./Commands/${_help}`);
        if ("data" in command){
            await commands.push(command.data.toJSON());
            await client.commandsInfo.set(command.data.name, command);
        }
    }
    await console.log(`Loading ${commands.length} command(s)..`);
    let error = false;
    const data = await rest.put(Routes.applicationCommands(clientid), { body: commands }).catch(async err => {
        await console.log(`!ERROR! While loading commands..${err}`);
        error = true;
    });
    await console.log(`${error ? `\n` : `Loaded ${data.length} command(s)!\n`}`)
}*/

function getChannel(queue){
    let rooms = JSON.parse(fs.readFileSync("Configs/rooms.json", "utf-8"));
    if (queue.textChannel.guild.channels.cache.has(rooms[queue.textChannel.guild.id].info))
        return queue.textChannel.guild.channels.cache.get(rooms[queue.textChannel.guild.id].info);
    return queue.textChannel;
}
distube
    .on("playSong", (queue, song) => getChannel(queue).send({ embeds: [getDistubeEmbed(client, "playSong", queue, song)] }))
    .on("addSong", (queue, song) => queue.textChannel.send({ embeds: [getDistubeEmbed(client, "addSong", queue, song)] }))
    .on("addList", (queue, list) => queue.textChannel.send({ embeds: [getDistubeEmbed(client, "addList", queue, list)] }))
    .on("empty", (queue) => {
        getChannel(queue).send({ embeds: [getDistubeEmbed(client, "empty", null, null)] });
    })
    .on("finish", (queue) => {
        getChannel(queue).send({ embeds: [getDistubeEmbed(client, "empty", null, null)] });
    })
    .on("error", (queue, error) => {
        getChannel(queue).send({ embeds: [getDistubeEmbed(client, "error", "Unknown error?\nCall administrator.. :(", null)] });
        console.log(`!ERROR! Unknown DisTube\n${error}\n`);
        saveError(error);
    });

client.once(Events.ClientReady, () => {
    saveError(`Discord Bot ${client.user.displayName} successfully turned on!`);
    console.log(`\n< ${new Date(new Date().getTime())} >\n< Discord Bot ${client.user.displayName} successfully turned on! >\n`);
    client.user.setActivity("Type /help for help 💡", { type: Discord.ActivityType.STREAMING, url: "https://github.com/marcko5/DiscordBot-Music" });
    try{
        let rooms = JSON.parse(fs.readFileSync("Configs/rooms.json", "utf-8"));
        for (const [guildid, value] of Object.entries(rooms)){
            if (value.errorSent)
                value.errorSent = false;
        }
        fs.writeFileSync("Configs/rooms.json", JSON.stringify(rooms, null, 2), "utf-8");
    }
    catch(err){
        fs.writeFileSync("Configs/rooms.json", JSON.stringify({}, null, 2), "utf-8");
        saveError(err);
    }
    fs.writeFileSync("Configs/cache.json", JSON.stringify({}, null, 2), "utf-8");
    for(const guild in client.guilds){
        if(getVoiceConnection(guild))
            getVoiceConnection(guild).leave();
    }
    loadCommands();
});
client.login(token);

module.exports = {
    client
}