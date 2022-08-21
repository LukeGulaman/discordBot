const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('server info reporting!'),

	async execute(interaction) {
		const serverCreateDate = new Date(interaction.guild.createdAt)
		const desc = interaction.guild.description

		if (desc == null) {
			desc = `No description available.`
		}

		const exampleEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setThumbnail(interaction.guild.iconURL())
		.setTitle(`Server name: \`${interaction.guild.name}\``)
		.addFields(
			{ name: 'Total Members:', value: `${interaction.guild.memberCount}`, inline: true },
			{ name: 'Server created at:', value: `\`${serverCreateDate.toLocaleDateString()}\``, inline: true},
			{ name: 'Description:', value: '```\n' + desc + '\n```'}
		)

		await interaction.reply({embeds: [exampleEmbed]});
	},
};