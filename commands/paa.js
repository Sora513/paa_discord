const { SlashCommandBuilder } = require('discord.js');
const { execSync } = require('child_process')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('paa')
        .setDescription('paa YYYY MM Duration to know classnum')
        .addStringOption(option =>
            option.setName('year')
                .setDescription('YYYY').setRequired(true))
        .addStringOption(option =>
            option.setName('month')
                .setDescription('MM').setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration Month').setRequired(true)),
    async execute(interaction) {
        const year = interaction.options.getString("year")
        const month = interaction.options.getString("month")
        const duration = interaction.options.getString("duration")
        const reply = execSync("/usr/bin/node /home/Sora513/paa_gcapi/main.js "+year+" "+month+" "+duration)
        await interaction.reply(reply.toString())
    },
};