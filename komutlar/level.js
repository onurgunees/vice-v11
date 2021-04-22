const Discord = require('discord.js');
const db = require('quick.db')
exports.run = async(client, message, args) => { 
  
  let kxp = await db.fetch(`xp_${message.author.id}_${message.guild.id}`)
  let klvl = await db.fetch(`lvl_${message.author.id}_${message.guild.id}`)
  var user = message.mentions.users.first() || message.author;
  
  let kontrol;
  if(klvl == null) kontrol = '0'
  else kontrol = kxp
  
  let kontrol2;
  if(klvl == null) kontrol2 = '0'
  else kontrol2 = klvl
  
  
  let seviye = new Discord.RichEmbed()
  .setTitle('Seviye Bilgisi')
.setDescription(user + " İşte Seviyen 💠")
  .addField('📌 Tecrübe Puanın', '**'+kontrol+'**', true)
  .addField('⭐ Seviyen', '**'+kontrol2+'**', true)
  .setFooter('')
  .setColor('PURPLE')
  .setThumbnail(user.avatarURL)
  message.channel.send(seviye)
 

 };
exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: ["seviye","level"], 
  permLevel: 0
};

exports.help = {
  name: 'lvl',
  description: 'taslak', 
  usage: 'lvl'
};