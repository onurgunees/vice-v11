const http = require("http");
const express = require("express");
const app = express();
var server = http.createServer(app);
const token = process.env.token;

app.get("/", (request, response) => {
  console.log(`Ping Received.`);
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Youtube");
});

const listener = server.listen(process.env.PORT, function() {
  console.log(`Port ` + listener.address().port);
});

const Discord = require("discord.js");
const client = new Discord.Client();
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment-timezone");
require("moment-duration-format");
const db = require("quick.db");
const YouTubeNotifier = require('youtube-notification');
const ayarlar = require('./ayarlar.json');
require('./util/alp')(client);
const ms = require("ms")
const { inspect } = require("util");
const fetch = require('node-fetch');

const notifier = new YouTubeNotifier({
  hubCallback: 'https://heather-juniper-indigo.glitch.me/yt',
  secret: 'alperrrsrsrsrsrs'
});
notifier.on('notified', data => {
  client.channels.get("800994045806772245").send(
    `**Youtube Kanalımıza Yeni Bir Video Eklendi! Haydi Sende Tıkla Ve Videoyu İzlemeye Başla !**\n**${data.video.link}**`
  );
});
 
notifier.subscribe("UCn-emvWwzUxNvkRhkzGgZAw");

app.use("/yt", notifier.listener());
client.on('message', message=>{
	//if(message.author.id === "757719969881391125") return;
	if(message.author.bot) return;
	if(message.channel.type === "dm") {
	const embed = new Discord.RichEmbed()
embed.setAuthor(message.author.tag + " yazmış ki", message.author.avatarURL)
.setColor('GREEN')
embed.setDescription(message.content)
embed.setTimestamp()
  if(message.attachments.size > 0) {

    embed.setImage(message.attachments.array()[0].url)
  }
client.channels.get('825682626919661580').send(embed)	
	}
})
client.on("message", async message => {
  if(!message.guild) return
  let prefix = ayarlar.prefix;

  var id = message.author.id;
  var gid = message.guild.id;

  let xps = await db.fetch(`verilecekxp_${gid}`);
  if (message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  var xp = await db.fetch(`xp_${id}_${gid}`);
  var lvl = await db.fetch(`lvl_${id}_${gid}`);
  var xpToLvl = await db.fetch(`xpToLvl_${id}_${gid}`);

  if (!lvl) {
    if (xps) {
      db.set(`xp_${id}_${gid}`, xps);
    }
    db.set(`xp_${id}_${gid}`, 4);
    db.set(`lvl_${id}_${gid}`, 1);
    db.set(`xpToLvl_${id}_${gid}`, 100);
  } else {
    if (xps) {
      db.add(`xp_${id}_${gid}`, xps);
    }
    db.add(`xp_${id}_${gid}`, 4);

    if (xp > xpToLvl) {
      db.add(`lvl_${id}_${gid}`, 1);
      db.add(
        `xpToLvl_${id}_${gid}`,
        (await db.fetch(`lvl_${id}_${gid}`)) * 100
      );

    client.channels.get('834149030166134806').send(message.member+" Seviye atladı **"+lvl+"**")

      
    }

  }
  
});  
moment.locale('tr')
client.on('ready', () => {
   setInterval(() => {
  var days = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
  const d = new Date()
  if(db.get('gün_'+d.getMonth()+"/"+d.getDate())) return;
  if(days[d.getDay()] === "Cumartesi")  {
    var saat = moment().tz('Europe/Istanbul').format('LT')
    var gerekensaat = "15:50"
    if(saat === gerekensaat) {
      db.set('gün_'+d.getMonth()+"/"+d.getDate(), true)
    client.channels.get('798876102953140234').send(' **📢 | Toplantı Başlıyooooor ! \n <a:siren:832219070073667635> | Tüm Yetkililerin Katılması Zorunludur. \n <a:onayy:832219198741676032> | Sunucu İçerisindeki Şikayet ve Önerilerinizi Gelip Belirtebilirsiniz. **\n @everyone')
                                                     
    }
  }
   }, 1000)
})
client.on('message', async(message) => {
  if(message.author.bot) return;
    if(message.channel.id !== '800994084549820487') return;
	if(message.content.toLowerCase().charAt(message.content.toLowerCase().length-1) === "ğ") {
		message.author.send("`ğ` ile başlayan bir cümle olduğundan `ğ` yasaktır!")
		return message.delete(1000)
	}
  if(message.content.startsWith('.')) return;
  if(message.content.split(" ").length > 1) return message.author.send('Sadece kelime*!*').then(msg => {
                
                  message.delete()
              })
  let kelime = db.get(`son_${message.guild.id}`)
  let kelimeler = db.get(`kelimeler_${message.guild.id}`)

  let kişi = db.get(`klm_${message.guild.id}`)
  if(kişi == message.author.id) return message.author.send('En son sen yazmışsın*!*').then(msg => {
                  
                  message.delete()
              })
  
  if(kelime == null) {
  let random = String.fromCharCode(65+Math.floor(Math.random() * 26))
  let son = random.charAt(random.length-1)
  db.set(`son_${message.guild.id}`, son)
  message.channel.send(`Oyun \`${son}\` harfi ile başladı!`)
  } 
  
  if(kelime.toLowerCase() !== message.content.toLowerCase().charAt(0)) return message.author.send('En son yazılan kelime **'+ kelime + '** ile bitmiş*!*').then(msg => {
                 
                  message.delete()
              })
  if(kelimeler) {
    if(kelimeler.includes(message.content)) return message.author.send('Bu kelime önceden yazılmış, tekrardan dene*!*').then(msg => {
  
      message.delete()
})
  }

  
  
  
  const api = await fetch(`https://sozluk.gov.tr/gts?ara=${encodeURI(message.content)}` )
        .then(response => response.json());
  if(api.error) return message.author.send('Yazdığın kelime, Türk Dil Kurumun\'da  bulunamadı *!*').then(msg => {
                 
                  message.delete()
  db.subtract(`puan_${message.guild.id}_${message.author.id}`, 1)
              })
  
  db.push(`kelimeler_${message.guild.id}`, message.content)
  db.set(`son_${message.guild.id}`, message.content.charAt(message.content.length-1))
  db.set(`klm_${message.guild.id}`, message.author.id)
  db.add(`puan_${message.guild.id}_${message.author.id}`, 2)
  message.react(`⭐`)
  })
  
client.on("message", async message => {
  if (!message.guild) return;
  const args = message.content.split(" ");
  const command = args.shift().toLowerCase();
  const prefix = "!";
  if(command === prefix+"komutdegisecek") {
    const embed = new Discord.RichEmbed()
    .setAuthor("Ripper Jailbreak - destek sistemi")
    .setColor('PURPLE')
    .setDescription('🎟️ Emojisine tıklayarak yetkililere ulaşabilirsiniz!')
    .setFooter(message.guild.name,message.guild.iconURL)
    message.channel.send(embed).then(e => e.react('🎟️'))
  }
  if (command === prefix+"destek-ekle") {
    if (!message.channel.name.includes(`💬-`)) return message.channel.send("Bu komut sadece `Destek Talep` kanallarında çalışmaktadır!");
    var args1 = message.content.slice(prefix+"destek-ekle".length).trim().split(' ');
    if(!args1[0]) return message.channel.send('Destek Talebine başka birini eklemek istiyorsanız: `'+prefix+'destek-ekle <kullanıcı_id>`')
		var victim = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!victim) return message.channel.send('Kullanıcı bulunamadı tekrar deneyin.')
if(victim.id === message.author.id) return message.channel.send('*Kendini ekleyemezsin!*')
    message.channel.overwritePermissions(victim.id, {SEND_MESSAGES: true,VIEW_CHANNEL: true,READ_MESSAGE_HISTORY: true})
    message.channel.send(victim +' *Adlı kişi destek talebine eklendi*')
  }
  
  if (command === prefix+"destek-çıkar") {
    if (!message.channel.name.includes(`💬-`)) return message.channel.send("Bu komut sadece `Destek Talep` kanallarında çalışmaktadır!");
    var args1 = message.content.slice("!destek-çıkar".length).trim().split(' ');
    if(!args1[0]) return message.channel.send('Destek Talebinden birini çıkarmak istiyorsanız: `!destek-çıkar <kullanıcı_id>`')
   		var victim = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!victim) return message.channel.send('Kullanıcı bulunamadı tekrar deneyin.')
    message.channel.overwritePermissions(victim.id, {SEND_MESSAGES: false,VIEW_CHANNEL: false,READ_MESSAGE_HISTORY: false})
    message.channel.send(victim +' *adlı kişi destek talebinden çıkarıldı!*') 
  }
  if (command === prefix+"kapat") {
    if (!message.channel.name.includes(`💬-`)) return message.channel.send("Bu komut sadece `Destek Talep` kanallarında çalışmaktadır!");
    db.add('toplamdestek', 1)
	db.add(message.author.id, 1)
    db.set('destek3_'+db.get(message.channel.id).id, false)
    if(message.author.id === db.get(message.channel.id).id) {
        client.users.get(db.get(message.channel.id).id).send('🎟️ Destek talebin sen tarafından kapatıldı!')
    } else {
        client.users.get(db.get(message.channel.id).id).send(`🎟️ Destek talebin \`${message.author.tag}\` tarafından kapatıldı!`)
    }
	return message.channel.delete();
  }
  if (command === prefix+"sayaç") {
    var args1 = message.content.slice("!sayaç".length).trim().split(' ');
     if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`Bu komutu kullanamazsın!`);
	var kanal = message.mentions.channels.first() || message.guild.channels.find(c => c.name === args1.slice(0).join(" "));
	if(!kanal) return message.channel.send('Sayaç ayarlamak için `!sayaç #kanal hedef` ')
	var sayı = args1[1]
	if(!kanal) return message.channel.send('Sayaç ayarlamak için `!sayaç #kanal hedef` ')
	if (args1[1] <= message.guild.memberCount) {
    return message.reply("Daha önceden girdiğiniz `Üye Sayısına` ulaşılmış" );
	}
	message.channel.send('Sayaç kanalı **'+kanal.name+'** olarak ayarlandı ve hedefimiz **'+sayı+'**')
	db.set('sayackanal', kanal.id)
	db.set('sayachedef', sayı)
   }
});

var kategori_id = "831229244826714163";
var sunucu = "798875895175577631";
var kanal = "834148435509903430";
var mesaj_id = "825710638709866556";
client.on("raw", event => {
  if (
    event.t === "MESSAGE_REACTION_ADD" ||
    event.t == "MESSAGE_REACTION_REMOVE"
  ) {
    if (!event.d.guild_id) return;
    let channels1 = client.guilds.get(sunucu);
    let channel = client.channels.get(kanal);
    let member =client.guilds.get("800993818111377439").members.find(u => u.id == event.d.user_id);

    let message = channel.fetchMessages(mesaj_id).then(msg => {
      let user = channels1.members.get(`${event.d.user_id}`);
      if (event.d.user_id != client.user.id) {
        var memberObj = channels1.members.get(`${event.d.user_id}`);
        if (event.d.channel_id === kanal) {
          console.log(event.d.emoji)
          if (event.d.emoji.name === "🎟️") {
            if (event.t === "MESSAGE_REACTION_ADD") {
              channel.fetchMessage(mesaj_id).then(message => {
                message.reactions
                  .get("🎟️")
                  .remove(event.d.user_id);
              });
                  if(db.get('destek3_'+event.d.user_id) === true) {
                return client.users.get(event.d.user_id).send('⛔ Açık destek talebiniz bulunuyor, lütfen sunucuyu kontrol ediniz.')
                }
              console.log(event.d)
              channels1
                .createChannel(`💬-destek-` + member.user.username, "text", [
                  {
                    id: channels1.id,
                    deny: [
                      "READ_MESSAGE_HISTORY",
                      "SEND_MESSAGES",
                      "VIEW_CHANNEL"
                    ]
                  }
                ])
                .then(channel => {
					 db.set(channel.id, { kanal: channel.id, id: event.d.user_id})
					 db.set("d_" + event.d.user_id, Date.now());
                db.set('destek3_'+event.d.user_id, true)
                  console.log(
                    "Kanal oluşturuldu. Destek: " +
                      event.d.member.user.username +
                      event.d.member.user.discriminator +
                      " (" +
                      event.d.user_id +
                      ")"
                  );
                  let category = channels1.channels.find(
                    c => c.id == kategori_id && c.type == "category"
                  );
                  channel.setParent(category.id);
                  channel.send("<@&800993989025071104>")
                  channel.send(
                    "Hoş geldin <@" +
                      event.d.user_id +
                      ">. Sana nasıl yardımcı olabilirim?"
                  );
                  channel.overwritePermissions(event.d.user_id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true
                  });
                  channel.overwritePermissions("800993989025071104", {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true
                  });
                                channel.overwritePermissions("800993983831605268", {
                  SEND_MESSAGES: true,
                  VIEW_CHANNEL: true,
                  READ_MESSAGE_HISTORY: true
                });
                });
            }
          }
        }
      }
    });
  }
});
let acik;
const m = require("moment");
client.on('guildMemberAdd', member => {
	var kanal = db.get('sayackanal')
	if(!kanal) return;
	var sayı = db.get('sayachedef')
	if(!sayı) return;
	if(sayı === member.guild.memberCount) {
	return db.add('sayachedef', 500)
	} else {
		client.channels.get(kanal).send(`📥 \`${member.user.username}\` aramıza katıldı \`${sayı}\` üye olmamıza son \`${sayı-member.guild.memberCount}\` kişi kaldı \`${member.guild.memberCount}\` kişiyiz`)
	}
})
client.on('guildMemberRemove', member => {
	db.add(`cikti_${new Date().getDay()}`, 1)
	var kanal = db.get('sayackanal')
	if(!kanal) return;
	var sayı = db.get('sayachedef')
	if(!sayı) return;
	client.channels.get(kanal).send(`📤 \`${member.user.username}\` aramızdan ayrıldı \`${sayı}\` üye olmamıza son \`${sayı-member.guild.memberCount}\` kişi kaldı \`${member.guild.memberCount}\` kişiyiz`)
})
client.on("message", async message => {
  const args = message.content.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "eval") {
    if (message.author.id !== "834148435509903430") return;
    let evaled;
    try {
      evaled = await eval(args.join(" "));
      console.log(evaled);
    } catch (error) {
      console.error(error);
      message.reply("Hata" + error.message);
    }
  }
});

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on('message', msg => {
  if (msg.content.toLowerCase() === '!youtube') {
    msg.channel.send('__Youtube Kanalımız__\nhttps://m.youtube.com/channel/UCn-emvWwzUxNvkRhkzGgZAw');
  }
  if (msg.content.toLowerCase() === 'sa') {
    msg.channel.send('Aleyküm Selam, Hoşgeldin.');
  }
  if (msg.content.toLowerCase() === 'Sa') {
    msg.channel.send('Aleyküm Selam, Hoşgeldin.');
  }
   if (msg.content.toLowerCase() === '!steam') {
    msg.channel.send('__Steam Topluluğumuz__\nhttps://steamcommunity.com/groups/viceoyuncutoplulugu');
  }
  if (msg.content.toLowerCase() === '!dc') {

   msg.channel.send('https://discord.gg/AQcU6gCqk5');
  }
  if(msg.content.toLowerCase() === "!gametracker00") {
    var s = new Discord.Attachment('https://cache.gametracker.com/server_info/185.193.165.132:27015/b_560_95_1.png', 'bum.png')
    msg.channel.send(s)
  }
  if (msg.content.toLowerCase() === '!durum') {
    msg.channel.send('');
  }
  if (msg.content.toLowerCase() === '!ip') {

   msg.channel.send('** İP Adresimiz ; 185.193.165.39:27015     ** Tıkla Bağlan =    http://steam/connect/185.193.165.39:27015     ');


 }
  


});
client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};



client.login(token);
  
