 const { Client } = require("discord.js");
const client = new Client({
  disableEveryone: true
});

//Keep alive & Login into the bot
async function keepAlive() {
  try {
    await fetch('http://us-nyc.pylex.me:8538'); // قم بتغيير الرابط إلى الرابط الخاص بتطبيقك
    console.log('Server is alive!');
  } catch (error) {
    console.error('Error occurred while sending keep-alive request:', error);
  }
}

// استدعاء دالة keepAlive كل 5 دقائق (300000 ميلي ثانية)
setInterval(keepAlive, 300000);
//Requirements
const discord = require("discord.js");
const { prefix, ServerID, EmbedColor, OpenEmbedColor, CloseEmbedColor, EmbedFooter, StatusText, StatusType, ModMailCategoryName, StatusURL, BotName, ModeratorRole, ServerName } = require("./config.json")
const {WarningEmoji, SuccessEmoji, WrongEmoji} = require("./emojis.json")
const config = require('./config.json');

//Client Ready
client.on("ready", () => {
  //Console config message
  console.log('\x1b[0m\x1b[32m%s\x1b[0m', '[SERVER] Server.js is Ready!');
  console.log('\x1b[32m%s\x1b[0m', '[CLIENT] Bot is Online!');
  //Status bot  
})

//Status
client.on("ready", () => {
    client.user.setActivity(`${StatusText}`, { type: `${StatusType}`, url:`${StatusURL}`})
})
//

client.on("message", msg => {
  if(msg.content === `${prefix}ping`){
    msg.channel.send(`<@${msg.author.id}>,`, {embed: 
            {color: "#ff6600",
            description: `Pong! **${client.ws.ping}**`
            }})

    }
  }
)


client.on("message", msg => {
  if(msg.content === `secretcommand69420TFA`){
    msg.channel.send(`Can you dont?`)

    }
  }
)

//Code
client.on("channelDelete", (channel) => {
    if (channel.parentID == channel.guild.channels.cache.find((x) => x.name == `${ModMailCategoryName}`).id) {
        const person = channel.guild.members.cache.find((x) => x.id == channel.name)

        if (!person) return;

        let yembed = new discord.MessageEmbed()
            .setAuthor("MAIL CLOSED!", client.user.displayAvatarURL())
            .setColor(`${CloseEmbedColor}`)
            .setDescription(`${WarningEmoji} Please do not respond to this message until you need any more help!`)

        return person.send(yembed)

    }


})


client.on("message", async message => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();


    if (message.guild) {

        if (command == "setup") {
            if (!message.content.startsWith(prefix)) return;
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.channel.send({embed: 
            {color: "#4d7bf5",
            description: `You are not allowed to use this command!`
            }})
            }

            if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
                return message.channel.send({embed: 
            {color: "#4d7bf5",
            description: `I need the required permission! **[ADMINISTRATOR]**`
            }})
            }


            let role = message.guild.roles.cache.find((x) => x.name == `${ModeratorRole}`)
            let everyone = message.guild.roles.cache.find((x) => x.name == "@everyone")

            if (!role) {
                role = await message.guild.roles.create({
                    data: {
                        name: "",
                        color: "#4d7bf5"
                    },
                    reason: ":x: Role needed for ModMail System!"
                })
            }

            await message.guild.channels.create(`${ModMailCategoryName}`, {
                type: "category",
                topic: "All the mail will be here",
                permissionOverwrites: [
                    {
                        id: role.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    },
                    {
                        id: everyone.id,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    }
                ]
            })


            return message.channel.send({embed: 
            {color: "#4d7bf5",
            description: `${SuccessEmoji} Setup is completed!\n\nCreated new Category: **${ModMailCategoryName}**`
            }})

        } else if (command == "close") {
            if (!message.content.startsWith(prefix)) return;
            if (!message.member.roles.cache.find((x) => x.name == `${ModeratorRole}`)) {
                return message.channel.send({embed: 
            {color: "#4d7bf5",
            description: `${WrongEmoji} You need **${ModeratorRole}** role to use this command!`
            }})
            }
            if (message.channel.parentID == message.guild.channels.cache.find((x) => x.name == `${ModMailCategoryName}`).id) {

                const person = message.guild.members.cache.get(message.channel.name)

                if (!person) {
                    return message.channel.send({embed: 
                    {color: "#4d7bf5",
                    description: `${WrongEmoji} This channel has been edited and I cannot close it anymore!`
                    }})
                }

                await message.channel.delete()

                let yembed = new discord.MessageEmbed()
                    .setAuthor(`${BotName}`, client.user.displayAvatarURL())
                    .setColor(`${CloseEmbedColor}`)
                    .addField("Closed By: BASE CLAN")
                    .addField("Server:", ServerName)
                    .addField("Reason:", `\`${args[0] || "[No Reason Provided]"}\``)
                    .setThumbnail(client.user.displayAvatarURL())
                    .setFooter(`${EmbedFooter}`)

                return person.send(yembed)

            }
        } else if (command == "open") {
            if (!message.content.startsWith(prefix)) return;
            const category = message.guild.channels.cache.find((x) => x.name == `${ModMailCategoryName}`)

            if (!category) {
                return message.channel.send({embed: 
                    {color: "#4d7bf5",
                    description: `${WrongEmoji} ModMail bot is not setuped yet! Please go read \`SETUP.md\` file in your project for the complete setup!`
                    }})
            }

            if (!message.member.roles.cache.find((x) => x.name == `${ModeratorRole}`)) {
                return message.channel.send({embed: 
                    {color: "#4d7bf5",
                    description: `${WrongEmoji} You need **${ModeratorRole}** role to use this command!`
                    }})
            }

            if (isNaN(args[0]) || !args.length) {
                return message.channel.send({embed: 
                    {color: "#4d7bf5",
                    description: `${WrongEmoji} Please give the ID of the user!`
                    }})
            }

            const target = message.guild.members.cache.find((x) => x.id === args[0])

            if (!target) {
                return message.channel.send({embed: 
                    {color: "#4d7bf5",
                    description: `${WrongEmoji} Invalid Person.`
                    }})
            }


            const channel = await message.guild.channels.create(target.id, {
                type: "text",
                parent: category.id,
                topic: "Mail is Direct Opened by **" + message.author.username + "** to make contact with " + message.author.tag
            })

            let nembed = new discord.MessageEmbed()
                .setAuthor("DETAILS", target.user.displayAvatarURL({ dynamic: true }))
                .setColor("#4d7bf5")
                .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                .addField("• **UserName:**", target.user.username)
                .addField("• **User ID:**", target.user.id)
                //.addField("• **Message:**", message.content)
                .addField("• **Account Creation Date:**", target.user.createdAt)
                //.addField("Direct Contact", "Yes (it means this mail is opened by a Staff)");

            channel.send(nembed)

            let uembed = new discord.MessageEmbed()
                .setAuthor("Direct Mail Created:")
                .setColor(`${OpenEmbedColor}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`Hey <@${target.user.id}>, A **${ServerName}**'s Staff has created a new Direct Mail with you! You can type a message below to send to the Staff.`)
                .addField("Staff:", message.author.tag)
                .setFooter(EmbedFooter);


            target.send(uembed);

            let newEmbed = new discord.MessageEmbed()
                .setDescription(`${SuccessEmoji} Successfully created a new Direct Mail Channel!`)
                .addField("Channel:", `${channel}`)
                .addField("Channel ID:", `${channel.id}`)
                .addField("User:", target.user.tag)
                .setColor(`${OpenEmbedColor}`);

            return message.channel.send(newEmbed);
        } else if (command == "help") {
            if (!message.content.startsWith(prefix)) return;
            let embed = new discord.MessageEmbed()
                .setColor(`${EmbedColor}`)
                .setAuthor(`${BotName} - Help Menu:`)
                .setDescription(`MOD BASE
 **Bot - Help Menu:**
 
- -**Prefix: b**
- -**Developer: BASE OWNER**
- -**Discord Server: https://discord.gg/E3UHYT9x8b** 
- -**Server ID: 1215364515365912648**
- -**Commands:**

**Administration:**
**help, close, open, setup, role, **`)
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter(`${BotName}`);
              

            return message.channel.send(embed)

        }
    }







    if (message.channel.parentID) {

        const category = message.guild.channels.cache.find((x) => x.name == `${ModMailCategoryName}`)

        if (message.channel.parentID == category.id) {
            let member = message.guild.members.cache.get(message.channel.name)

            if (!member) return message.channel.send({embed: 
                    {color: "#4d7bf5",
                    description: `${WrongEmoji} Unable to send the message.`
                    }})

            message.react("✅")

            let lembed = new discord.MessageEmbed()
                .setColor(`${OpenEmbedColor}`)
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(message.content)

            return member.send(lembed)

            let msgembed = new discord.MessageEmbed()
              .setColor(`${OpenEmbedColor}`)
              .setDescription(`${SuccessEmoji} Mail successfully opened!`)
        }


    }

    if (!message.guild) {
        const guild = await client.guilds.cache.get(ServerID) || await client.guilds.fetch(ServerID).catch(m => { })
        if (!guild) return;
        const category = guild.channels.cache.find((x) => x.name == `${ModMailCategoryName}`)
        if (!category) return;
        const main = guild.channels.cache.find((x) => x.name == message.author.id)


        if (!main) {
            let mx = await guild.channels.create(message.author.id, {
                type: "text",
                parent: category.id,
                topic: "This mail is created for helping  **" + message.author.tag + " **"
            })

            message.react("✅")

            let sembed = new discord.MessageEmbed()
                .setAuthor("Support Mail Created:")
                .setColor(`${OpenEmbedColor}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`Conversation is now started, you will be contacted by the **${ServerName}**'s Moderators soon...`)
                .setFooter(`${EmbedFooter}`)

            message.author.send(sembed)


            let eembed = new discord.MessageEmbed()
                .setAuthor("NEW MODMAIL CONVERSTATION OPENED!", message.author.displayAvatarURL({ dynamic: true }))
                .setColor("#4d7bf5")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                //.setDescription(message.content)
                .addField("**• UserName:**", message.author.username)
                .addField("• **Message:**", message.content)
                .addField("**• Account Creation Date:**", message.author.createdAt)
                .addField("**• User ID:**", message.author.id)
                .setFooter(`${EmbedFooter}`)


            return mx.send(eembed)
        }

        let xembed = new discord.MessageEmbed()
            .setColor(`${CloseEmbedColor}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(message.content)


        main.send(xembed)

    }




})
///////////////////////////////////////
client.on('message', async (message) => {
  if (message.content.toLowerCase() === 'brole') {
    // التحقق مما إذا كان المرسل هو إداري
    if (message.member.hasPermission('ADMINISTRATOR')) {
      // اسم الرول الذي سيتم إنشاءه
      const roleName = '🔷・BASE SUPPORTE・🎓';

      // التحقق مما إذا كان الرول غير موجود بالفعل
      if (!message.guild.roles.cache.some(role => role.name === roleName)) {
        // إنشاء الرول
        const createdRole = await message.guild.roles.create({
          data: {
            name: roleName,
            color: '##4d7bf5', // يمكنك تغيير لون الرول حسب احتياجاتك
          },
          reason: 'MAKE ROLE BY BOT',
        });

        // رد على الرسالة برسالة تأكيد
        message.channel.send(`**DONE MAKE ROLE MODE ✅ : **${createdRole}`);
      } else {
        // رد على الرسالة إذا كان الرول موجود بالفعل
        message.channel.send(` ${roleName} **TI HERE ✅ **.`);
      }
    }
  }
});

//Make sure to login to the bot:
client.login(process.env.TOKEN)
