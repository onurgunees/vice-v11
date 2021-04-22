const { RichEmbed } = require("discord.js");

exports.run = async(client, message, args) => { 
  //if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send('Bu komutu kullanabilmek için `Sunucuyu Yönet` yetkisi gerekmekte.')
  
       let kanal = message.guild.channels.get(args[0]);
       
       if(!kanal) {
         message.channel.send('Örnek Kullanımı\n **!seslideçekiliş <#kanalid>**')
       } 
        if(kanal) {
			var msg = await message.channel.send('ÇEKİYORUMMM')
			
          const embed = new RichEmbed()
		 embed  .setAuthor(kanal.name + ' adlı sesli kanal da çektiiim!', client.user.avatarURL)
         embed .setColor('PURPLE')
		  if(args[1]) {
		embed  .setDescription("Çekilişi Kazanan: " + kanal.members.random().user+"\nÖdül: **"+args.slice(1).join(' ')+"**")
		  } else {
        embed  .setDescription("Çekilişi Kazanan: " + kanal.members.random().user)
		  }
        embed  .setTimestamp()
        embed   .setFooter("Vice")
	
          msg.edit('',embed)
        }
};

exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: ["seslideçekiliş"], 
  permLevel: 0
};

exports.help = {
  name: 'seslide-çekiliş',
  description: 'taslak', 
  usage: 'sıralama'
};
