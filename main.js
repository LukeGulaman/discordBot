const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const { token } = require('./config.json');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Bot unit ready.');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'bruh, the bot broke\ntell this to the guy who made this', ephemeral: true });
	}
});

client.on('guildMemberAdd', member => {
	const channel = client.channels.cache.get('1007664222970331276');
	const canvas = Canvas.createCanvas(785, 600);
	const context = canvas.getContext('2d');

	const randomText = [
		'We hope you enjoy your stay!',
		'Send your unfunny memes NOW!',
		'We hope you brought pizza!',
		'haha your funny',
		'kris is a cool guy yknow',
		'this took 2.5 hours to make plz help',
		'hi random user',
		'why did you join this server?',
		'hi',
	];

	function getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min) ) + min;
	};

	const applyText = (canvas, text) => {
		const context = canvas.getContext('2d');

		let fontSize = 70;
		
		do {
			context.font = `${fontSize -= 10}px consolas`;
		} while (context.measureText(text).width > canvas.width - 300);

		return context.font;
	};

	const background = Canvas.loadImage('./banner.png');
	context.drawImage(background, 0, 0, canvas.width, canvas.height);				

	context.strokeStyle = '#ffffff';
	context.lineWidth = 10;	
		
	context.font = '42px consolas';
	context.fillStyle = '#ffffff';
	context.fillText('Welcome,', 250, 350);

	context.font = applyText(canvas, member.user.username)
	context.fillStyle = '#ffffff';
	context.fillText(`${member.user.username}!`, 250, 420);	

	context.font = '30px consolas';
	context.fillStyle = '#ffffff';
	context.fillText(randomText[getRndInteger(1, randomText.length)], 250, 500);	
		
	context.beginPath();
	context.arc(125, 400, 100, 0, Math.PI * 2, true);
	context.closePath();	
	context.stroke();	
	context.clip();			

	const { body } = request(member.user.avatarURL({ extension: 'jpg' }));
	const avatar = Canvas.loadImage(body.arrayBuffer());
	context.drawImage(avatar, 25, 300, 200, 200);	

	const attachment = new AttachmentBuilder(canvas.encode('png'), { name: 'welcome-banner.png' });
	channel.send({ files: [attachment] });
})

client.login(token);