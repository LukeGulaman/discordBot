const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('checking avatar designs...')
		.addUserOption(option => option.setName('user').setDescription('the user target').setRequired(true)),
				
	async execute(interaction) {	
		const userTarget = interaction.options.getUser('user');
		const avatarClearInfo = {format: 'png', size: 1024, dynamic: true}

		exampleEmbed = new EmbedBuilder()
		.setColor([0, 205, 50])
		.setTitle(`Avatar URL`)
		.setURL(userTarget.avatarURL(avatarClearInfo))
		.setAuthor({name: userTarget.tag, iconURL: userTarget.avatarURL(avatarClearInfo)})
		.setImage(userTarget.avatarURL(avatarClearInfo));		

		await interaction.reply({ embeds: [exampleEmbed] });		
	},
};