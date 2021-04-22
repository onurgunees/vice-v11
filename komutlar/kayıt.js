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
	var kayituye = message.guild.members.get(args[0]) || message.mentions.members.first();
if(!kayituye) return message.reply("Kullanıcı bulunamadı!").then(x => x.delete(5000))
let kayitnick = args.slice(1).join(' ')
console.log(kayituye)


if(!kayitnick) {
 return  message.channel.send('Kayıt edilecek kullanıcı adı girilmedi')
}
message.channel.send(kayituye + "** Başarıyla kayıt edildi!**")
  kayituye.setNickname(kayitnick)
  kayituye.removeRole("831232975927902278").catch();
  kayituye.addRole('831229840211836978')
  
} else {
	message.channel.send('*Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!*')
	
}
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['kayıt'],
  permLevel: 0
};

exports.help = {
  name: 'kayıt',
  description: 'Belirlenen miktarda mesajı siler.',
  usage: 'sil <silinicek mesaj sayısı>'
};
