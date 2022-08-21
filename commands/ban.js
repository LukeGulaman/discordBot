const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('user gone without a trace.')
		.addMentionableOption(option => option.setName('user').setDescription('the user target').setRequired(true))
		.addIntegerOption(option => option.setName('duration').setDescription('duration in days').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('add reason here').setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers),
				
	async execute(interaction) {
			const userTarget = interaction.options.getMember('user');	
			const durationInput = interaction.options.getInteger('duration')
			let reasonText = interaction.options.getString('reason');

			if(reasonText == null){
			reasonText = "No reason provided.";
			}

			// userTarget.ban({days: durationInput, reason: reasonText})

			const exampleEmbed = new EmbedBuilder()
			.setColor([235, 25, 25])
			.setDescription(`${userTarget.user.tag} is bombarded and banned from the server!`)
			.addFields(
				{ name: 'Reason:', value: `\`${reasonText}\``},
				{ name: 'Duration:', value: `\`${durationInput} days\``}
			)

			await interaction.reply({ embeds: [exampleEmbed] });	
	},
};