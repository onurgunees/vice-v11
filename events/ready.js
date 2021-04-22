const chalk = require('chalk');
const moment = require('moment');
const Discord = require('discord.js');
const giveaways = require("discord-giveaways");
const ayarlar = require('../ayarlar.json');
const qdb = require("quick.db");
const db = new qdb.table("mute");  
const db1 = new qdb.table("vip");  
var prefix = ayarlar.prefix;
const CSGO = require("csgo-api")
const srv = new CSGO.Server('185.193.165.39', '27015')
 

module.exports = client => {
            setInterval(()=>{
            srv.getPlayerCount().then(data => client.user.setActivity(data+"/44 Kişi Ripper"))
            },2000)
    
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Aktif, Komutlar yüklendi!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: ${client.user.username} ismi ile giriş yapıldı!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Oyun ismi ayarlandı!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Şu an ` + client.channels.size + ` adet kanala, ` + client.guilds.size + ` adet sunucuya ve ` + client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + ` kullanıcıya hizmet veriliyor!`);
};
