require("dotenv").config();
const token = process.env.TOKEN;
const clientid = process.env.CLIENTID;
const guildid = process.env.GUILDID;

const fs = require("fs");

const Discord = require("discord.js");
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

const { DisTube } = require("distube");
const { DeezerPlugin } = require("@distube/deezer");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { getBasicEmbed } = require("./embedCreator");
const distube = new DisTube(client, {
    nsfw: true,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    savePreviousSongs: true,
    plugins: [new DeezerPlugin(), new SpotifyPlugin({ emitEventsAfterFetching: true }), new SoundCloudPlugin(), new YtDlpPlugin({ update: false })]
});

client.on(Events.InteractionCreate, async (int) => {
    if (!int.user.bot && int.isCommand){
        const command = client.commandsInfo.get(int.commandName);
        await int.deferReply();
        if (command){
            try{
                await command.execute(client, int);
            }
            catch(err){
                await int.editReply({ embeds: [getBasicEmbed(client, "error", "(❌) Error", `While processing **${int.commandName}** an error occured..\nAnyway, **try again** later!`)], ephemeral: true });
                await console.log(`!ERROR! While processing ${int.commandName} command\n${err}`);
            }
        }
    }
});

const rest = new REST().setToken(token);
client.commandsInfo = new Collection();
client.distube = distube;
async function loadCommands(){
    const commands = [];
    for (const file of fs.readdirSync("./Commands")){
        delete require.cache[require.resolve(`./Commands/${file}`)];
        const command = require(`./Commands/${file}`);
        if ("data" in command){
            await commands.push(command.data.toJSON());
            await client.commandsInfo.set(command.name, command);
        }
    }
    console.log(`Loading ${commands.length} command(s)..`);
    /*client.guilds.cache.forEach(async guild => {
        await rest.put(Routes.applicationGuildCommands(clientid, guild.id), { body: [] }).catch(async err => await console.log(`!ERROR! While erasing commands on specific guild ${guild.name} [${guild.id}]..\n\n${err}`));
    });
    var data = await rest.put(Routes.applicationCommands(clientid), { body: [] }).catch(async err => await console.log(`!ERROR! While erasing commands..\n\n${err}`));*/
    var error = false;
    const data = await rest.put(Routes.applicationCommands(clientid), { body: commands }).catch(async err => {
        await console.log(`!ERROR! While loading commands..\n${err}`);
        error = true;
    });
    await console.log(`${error ? `\n` : `Loaded ${data.length} command(s)!\n`}`)
}

client.once(Events.ClientReady, () => {
    console.log(`\n< ${new Date(new Date().getTime())} >\n< Discord Bot ${client.user.displayName} successfully turned on! >\n`);
    loadCommands();
});
client.login(token);