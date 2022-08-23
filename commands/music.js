const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { createAudioPlayer, NoSubscriberBehavior, JoinVoiceChannel } = require('@discordjs/voice');

const player = createAudioPlayer({
  behavior: {
    noSubscriber: NoSubscriberBehavior.Pause
  },
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('incoming music transmission...')
    .addSubcommand(subcommand =>
      subcommand.setName('add')
        .setDescription('add music to the queue')
        .addStringOption(option =>
          option.setName('link')
            .setDescription('the music link')))
    .addSubcommand(subcommand =>
      subcommand.setName('skip')
        .setDescription('skip the current music'))
    .addSubcommand(subcommand =>
      subcommand.setName('stop')
        .setDescription('stop the player')),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === "add") {
      JoinVoiceChannel({
        channelID: interaction.member.voice.channelId,
        guildID: interaction.guild.id,
        adaptorCreator: interaction.guild.voiceAdaptorCreator,
      });

      await interaction.reply("added music")
    } else if (interaction.options.getSubcommand() === "skip") {
      await interaction.reply("skipped current music!")
    } else if (interaction.options.getSubcommand() === "stop") {
      await interaction.reply("stopped the player!")
    }
  }
}