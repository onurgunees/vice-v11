const Discord = require('discord.js');
const client = new Discord.Client();
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');



exports.run = function(client, message, args) {
let a = message.guild.roles.find("name", "Bot Commands");
let b = message.guild.roles.find("name", "+");
let c = message.guild.roles.find("name", "");
let d = message.guild.roles.find('name', "");
if(message.member.roles.has(b.id)|| message.member.roles.has(a.id) || message.member.roles.has(c.id) || message.member.roles.has(d.id)) {
  message.guild.roles.forEach(rol => {
    console.log(rol.id)
    if(rol.id === "800994011669725204") return; //kayıtsız oyuncu buga girmesin diye
    message.channel.overwritePermissions(rol, { SEND_MESSAGES: true });		
  })
		message.reply("Kanal kilitlenmesi kaldırıldı!");
} else {
	message.channel.send('*Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!*')
	
}
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['unlock'],
  permLevel: 0
};

exports.help = {
  name: 'kilit-kaldır',
  description: 'Belirlenen miktarda mesajı siler.',
  usage: 'sil <silinicek mesaj sayısı>'
};
