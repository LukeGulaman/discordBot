const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('check for latency'),

	async execute(interaction) {
		const sent = await interaction.reply({ content: 'playing ping pong...', fetchReply: true, ephemeral: true });
		interaction.editReply(`pong! \`${sent.createdTimestamp - interaction.createdTimestamp}ms\``);
	},
};