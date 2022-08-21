const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('a lil\' user info at your door.')
		.addUserOption(option => option.setName('user').setDescription('the user target').setRequired(true)),

	async execute(interaction) {
		const userTarget = interaction.options.getMember('user');

		const avatarClearInfo = {format: 'png', size: 1024, dynamic: true};

		const accDate = new Date(userTarget.user.createdAt);
		const accJoinDate = new Date(userTarget.joinedAt);
		
		let userNick = userTarget.nickname
		if(userNick == null){
			userNick = "N/A"
		}

		const exampleEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setThumbnail(userTarget.user.avatarURL(avatarClearInfo))
		.addFields(
			{ name: 'User\'s tag:', value: `\`${userTarget.user.tag}\``, inline: true},
			{ name: 'User\'s nickname:', value: `\`${userNick}\``, inline: true},
			{ name: 'User\'s id:', value: `\`${userTarget.user.id}\``, inline: true},
			{ name: 'Account created at:', value: accDate.toLocaleDateString(), inline: false },
			{ name: 'Account joined server at:', value: accJoinDate.toLocaleDateString(), inline: false}
		)

		await interaction.reply({embeds: [exampleEmbed]});
	},
};