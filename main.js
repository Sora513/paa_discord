require('dotenv').config();

const token = process.env.TOKEN;

if (token != undefined) {
    console.log("Successfully got token")
    // Require the necessary discord.js classes
    const { Client, Collection, Events, GatewayIntentBits, CategoryChannel } = require('discord.js');
    const fs = require('node:fs');
    const path = require('node:path');

    // Create a new client instance
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }


    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });

    //サーバーに招待された時の処理
    client.on('guildCreate', guild => {
        console.log("joined new server: " +guild.name)
        guild.channels.create({
            name: "bp_news",
        }).then(() => {
            //招待された時のメッセージ
            guild.channels.cache.find(ch => ch.name === "bp_news").send("招待いただきありがとうございます!このチャンネルにBLUEPROTOCOL公式サイトの更新情報をお知らせします!")
        }).catch(err => { console.log("On create ERR: " + err) })

    })

    // When the client is ready, run this code (only once)
    // We use 'c' for the event parameter to keep it separate from the already defined 'client'
    client.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    // Log in to Discord with your client's token
    client.login(token);
} else {
    console.log("FAILED: TOKEN is undefined")
}