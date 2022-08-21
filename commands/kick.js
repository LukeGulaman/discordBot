const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('bombarding user!')
		.addMentionableOption(option => option.setName('user').setDescription('the user target').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('add reason here').setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers),
				
	async execute(interaction) {	
		const userTarget = interaction.options.getMember('user');		
		let reasonText = interaction.options.getString('reason');
	
		if(reasonText == null){
			reasonText = "No reason provided.";
		}
	
		const exampleEmbed = new EmbedBuilder()
		.setColor([235, 25, 25])
		.setDescription(`${userTarget.tag} is kicked from the server!\n reason: \`${reasonText}\``)
	
		userTarget.kick()
		await interaction.reply({ embeds: [exampleEmbed] });	
					
	},
};