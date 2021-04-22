const Discord = require('discord.js');
const db = require('quick.db')
exports.run = async (client, message, args) => {

let user = message.author;
let id = message.author.id
let guild = message.guild;
let gid = message.guild.id
let sayi = 1
  let map = message.guild.members
    .filter(mem => !mem.user.bot)
    .array()
    .sort((a, b) => {
      return (
        (db.fetch(`xp_${b.user.id}_${message.guild.id}`) || 0) -
        (db.fetch(`xp_${a.user.id}_${message.guild.id}`) || 0)
      );
    })
    .slice(0, 5)
    .map(member => {
      return "```css\n"+`${sayi++}. ${member.user.username+"#"+member.user.discriminator} | Tecrübe Puanı: ${db.fetch(`xp_${member.user.id}_${message.guild.id}`) || `0`} | Seviye: ${db.fetch(`lvl_${member.user.id}_${message.guild.id}`) || `1`}`+"```"
    });message.channel.send(new Discord.RichEmbed()
.setColor("PURPLE")
.setAuthor(`${message.guild.name} Sunucu Sıralaması`, message.guild.iconURL)
.setDescription( map.join('\n'))
                            .setTimestamp()
.setFooter(`İsteyen: ${message.author.tag}`, message.author.avatarURL))
};
exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: ["top","top10"], 
  permLevel: 0
};

exports.help = {
  name: 'sıralama',
  description: 'taslak', 
  usage: 'sıralama'
};