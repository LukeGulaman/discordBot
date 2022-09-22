const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, NoSubscriberBehavior, JoinVoiceChannel, AudioPlayerStatus  } = require('@discordjs/voice');

const player = createAudioPlayer({
  behavior: {
    noSubscriber: NoSubscriberBehavior.Pause
  },
});

let musicQueue = []

module.exports = {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('incoming music transmission...')
    .addSubcommand(subcommand =>
      subcommand.setName('play')
        .setDescription('play music')
        .addStringOption(option =>
          option.setName('link')
            .setDescription('the music link')))
    .addSubcommand(subcommand =>
      subcommand.setName('skip')
        .setDescription('skip the current music'))
    .addSubcommand(subcommand =>
      subcommand.setName('stop')
        .setDescription('stop the player'))
    .addSubcommand(subcommand =>
      subcommand.setName('play')
      .setDescription('play music'))
    .addSubcommand(subcommand =>
      subcommand.setName('clear')
      .setDescription('clear music queue')),    

  async execute(interaction) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({ content: "what voice channel did you join??", ephemeral: true });
  }

  if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
      return void interaction.reply({ content: "currently playing music on a channel :p", ephemeral: true });
  }

    if(interaction.options.getSubcommand == "play") {
      await interaction.deferReply();

      const query = interaction.options.getString("link");
      const searchResult = await player
          .search(query, {
              requestedBy: interaction.user,
              searchEngine: QueryType.AUTO
          })
          .catch(() => {});
      if (!searchResult || !searchResult.tracks.length) return void interaction.followUp({ content: "you searched a non-existant song/music" });

      const queue = await player.createQueue(interaction.guild, {
          metadata: interaction.channel
      });

      try {
          if (!queue.connection) await queue.connect(interaction.member.voice.channel);
      } catch {
          void player.deleteQueue(interaction.guildId);
          return void interaction.followUp({ content: "could not join your voice channel (scary)" });
      }

      await interaction.followUp({ content: `loading your ${searchResult.playlist ? "playlist" : "track"}...` });
      searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();

    } else if (interaction.options.getSubcommand() == "skip") {

      await interaction.deferReply();
      const queue = player.getQueue(interaction.guildId);
      if (!queue || !queue.playing) return void interaction.followUp({ content: "no music is playing, you 0 iq" });
      const currentTrack = queue.current;
      const success = queue.skip();
      return void interaction.followUp({
        content: success ? `skipped \`${currentTrack}\`!` : "oh no, something went wrong"
      });

    } else if (interaction.options.getSubcommand() == "stop") {

      await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "no music is playing, you 0 iq" });
        queue.destroy();
        return void interaction.followUp({ content: "stopped the player to blast music" });

    };
  }
}