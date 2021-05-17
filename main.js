const Discord = require('discord.js');
const client = new Discord.Client()
const db = require('quick.db');
const config = require('./confguration.json')
const moment = require("moment")
let prefix = config.prefix
client.login(config.Token)

client.on('ready', () => {
    console.log(`Loggged in as ${client.user.tag}`)
    console.log('Bot Developer: Ali#0007')
    client.user.setActivity(`${prefix}help`)
})


client.on('message', async message => {
    if (message.content.startsWith(prefix + 'blacklist')) {
        if (message.author.id !== config.ownerID) return; ///put ur id here
        const blacklistuser = message.mentions.members.first()
        if (!blacklistuser) return message.channel.send(`Please specify a member!`)
        let Blacklist = await db.fetch(`Blacklist_${blacklistuser.id}`);
        if (Blacklist === null) Blacklist = "off";
        message.channel.send(`Added <@${blacklistuser.id}> to the blacklist!`)
        await db.set(`Blacklist_${blacklistuser.id}`, "on")
    } else {
        if (message.content.startsWith(prefix + 'unblacklist')) {
            let userUnblacklist = message.mentions.users.first() || message.guild.members.cache.get(args[1]);
            let Blacklist = await db.fetch(`Blacklist_${userUnblacklist.id}`);
            if (Blacklist === null) Blacklist = "off";
            if (!userUnblacklist) {
                message.channel.send('Please mention someone')
                return;
            }
            message.channel.send(`Removed <@${userUnblacklist.id}> from the blacklist! `);

            db.set(`Blacklist_${userUnblacklist.id}`, "off");
        }
    }
})

client.on('message', async message => {
    let Blacklist = await db.fetch(`Blacklist_${message.author.id}`);
    if (Blacklist === "on") {
        message.channel.send('You are blacklist contact with the owner!')
        return;
    }
    if (message.content.startsWith(prefix + 'ban')) {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("You don't have the required presmission `BAN_MEMBERS`");
        let user = message.mentions.members.first()
        if (!user) return message.channel.send(`Please specify a member to ban!`)

        let banEmbed = new Discord.MessageEmbed()
            .setTitle(`Ban Command`)
            .setThumbnail(message.author.avatarURL())
            .setFooter(`Request By ${message.author.tag}`, message.author.avatarURL())
            .setDescription(`${user} banned by ${message.author}`)
            .setColor("RANDOM")
        await message.channel.send(banEmbed)
        await user.ban()

    } else {
        if (message.content.startsWith(prefix + 'kick')) {
            if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("You don't have the required presmission `KICK_MEMBERS`");
            let user = message.mentions.members.first()
            if (!user) return message.channel.send(`Please specify a member to kick!`)

            let kickEmbed = new Discord.MessageEmbed()
                .setTitle(`kick Command`)
                .setThumbnail(message.author.avatarURL())
                .setFooter(`Request By ${message.author.tag}`, message.author.avatarURL())
                .setDescription(`${user} kicked by ${message.author}`)
                .setColor("RANDOM")
            await message.channel.send(kickEmbed)
            await user.kick()
        } else {
            if (message.content.startsWith(prefix + 'avatar')) {
                let user = message.mentions.members.first()
                if (!user) {
                    user = message.member;
                }
                const avaEmbed = new Discord.MessageEmbed()
                    .setTitle(`Avatar command`)
                    .setColor("RANDOM")
                    .setImage(user.user.avatarURL())
                    .setFooter(`Requestd by: ${message.author.tag}`, message.author.avatarURL())
                await message.channel.send(avaEmbed)
            } else {
                if (message.content.startsWith(prefix + 'startvote')) {
                    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("You don't have the required presmission `MANAGE_MESSAGES`");
                    let vote = message.content.split(" ").slice(1).join(" ");
                    if (!vote) return message.channel.send(`Please type a vote!`)
                    const voteEmbed = new Discord.MessageEmbed()
                        .setTitle(`Vote Started: `)
                        .setDescription(`${vote}`)
                        .setFooter(`Requestd by: ${message.author.tag}`, message.author.avatarURL())
                        .setColor("RANDOM")
                        .setFooter(`Request By ${message.author.tag}`, message.author.avatarURL())
                    message.delete()
                    message.channel.send(voteEmbed).then(async message => {
                        await message.react("✅");
                        await message.react("❌");
                    })
                } else {
                    if (message.content.startsWith(prefix + 'ping')) {
                        message.channel.send('🏓 Pinging....').then((msg) => {
                            const pEmbed = new Discord.MessageEmbed()
                                .setTitle('🏓 Pong!')
                                .setColor('RANDOM')
                                .setDescription(
                                    `Latency: ${Math.floor(
                                    msg.createdTimestamp - message.createdTimestamp,
                                )}ms\nAPI Latency: ${client.ws.ping}ms`,
                                );
                            msg.edit(pEmbed);
                        });
                    } else {
                        if (message.content.startsWith(prefix + 'server')) {
                            const text = message.guild.channels.cache.filter(r => r.type === "text").size
                            const voice = message.guild.channels.cache.filter(r => r.type === "voice").size
                            const chs = message.guild.channels.cache.size
                            const avaibles = message.guild.features.map(features => features.toString()).join("\n")
                            const roles = message.guild.roles.cache.size
                            const online = message.guild.members.cache.filter(m => m.presence.status === 'online').size
                            const idle = message.guild.members.cache.filter(m => m.presence.status === 'idle').size
                            const offline = message.guild.members.cache.filter(m => m.presence.status === 'offline').size
                            const dnd = message.guild.members.cache.filter(m => m.presence.status === 'dnd').size
                            const niro = new Discord.MessageEmbed()
                                .setAuthor(message.guild.name, message.author.avatarURL({
                                    dynamic: true,
                                    format: 'png',
                                    size: 1024
                                }))
                                .setColor("RANDOM")
                                .addFields({
                                    name: `🆔 Server ID`,
                                    value: `${message.guild.id}`,
                                    inline: true
                                }, {
                                    name: `📆 Created On`,
                                    value: message.guild.createdAt.toLocaleString(),
                                    inline: true
                                }, {
                                    name: `👑 Owner By`,
                                    value: `${message.guild.owner}`,
                                    inline: true

                                }, {
                                    name: `👥 Members (${message.guild.memberCount})`,
                                    value: `**${online}** Online \n **${message.guild.premiumSubscriptionCount}** Boosts ✨`,
                                    inline: true
                                }, {
                                    name: `💬 Channels (${chs})`,
                                    value: `**${text}** Text | **${voice}** Voice`,
                                    inline: true
                                }, {
                                    name: `🌍 Others`,
                                    value: `**Region:** ${message.guild.region}\n**Verification Level:** ${message.guild.verificationLevel}`,
                                    inline: true
                                }, {
                                    name: `🔐 Roles (${roles})`,
                                    value: `To see a list with all roles use #roles`,
                                    inline: true
                                }, )
                                .setFooter(`Request By ${message.author.tag}`, message.author.avatarURL())
                            message.channel.send(niro)
                        } else {
                            if (message.content.startsWith(prefix + 'user')) {
                                var args = message.content.split(" ").slice(1);
                                let user = message.mentions.users.first();
                                var men = message.mentions.users.first();
                                var heg;
                                if (men) {
                                    heg = men
                                } else {
                                    heg = message.author
                                }
                                var mentionned = message.mentions.members.first();
                                var h;
                                if (mentionned) {
                                    h = mentionned
                                } else {
                                    h = message.member
                                }
                                moment.locale('en-TN');
                                let id = new Discord.MessageEmbed()
                                    .setColor("RANDOM")
                                    .setFooter(`Request By ${message.author.tag}`, message.author.avatarURL())
                                    .addField('**JOINED DISCORD :**', `${moment(heg.createdTimestamp).format('YYYY/M/D')} **\n** \`${moment(heg.createdTimestamp).fromNow()}\``, true)
                                    .addField('**JOINED SERVER :**', `${moment(h.joinedAt).format('YYYY/M/D')} \n \`${moment(h.joinedAt).fromNow()}\``, true)
                                    .setThumbnail(heg.avatarURL({
                                        dynamic: true,
                                        format: 'png',
                                        size: 1024
                                    }));
                                message.channel.send(id)
                            } else {
                                if (message.content.startsWith(prefix + 'hide')) {
                                    if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send("You don't have the required presmission `MANAGE_CHANNELS`")
                                    let everyone = message.guild.roles.cache.find(niro => niro.name === '@everyone');
                                    message.channel.createOverwrite(everyone, {
                                        VIEW_CHANNEL: false
                                    }).then(() => {
                                        message.channel.send(`Done Hide ${message.channel} Room`)
                                    })

                                } else {
                                    if (message.content.startsWith(prefix + 'show')) {
                                        if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send("You don't have the required presmission `MANAGE_CHANNELS`")
                                        let everyone = message.guild.roles.cache.find(niro => niro.name === '@everyone');
                                        message.channel.createOverwrite(everyone, {
                                            VIEW_CHANNEL: true
                                        }).then(() => {
                                            message.channel.send(`Done Show ${message.channel} Room`)
                                        })

                                    } else {
                                        if (message.content.startsWith(prefix + 'mute')) {
                                            if (!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send("You don't have the required presmission `MUTE_MEMBERS`");
                                            let targetMuted = message.mentions.members.first(); {
                                                if (!targetMuted) return message.channel.send(`Please specify a member!`)
                                            }
                                            if (!message.guild.member(targetMuted).bannable) return message.channel.send('I can\'t mute one higher than me')
                                            let reasonMuted = message.content.split(" ").slice(1).join(" "); {
                                                if (!reasonMuted) return message.channel.send(`Please write a reason!`)
                                            }
                                            let MutedRole = message.guild.roles.cache.find(role => role.name == 'Muted')
                                            if (!MutedRole) {
                                                message.guild.roles.create({
                                                    data: {
                                                        name: 'Muted',
                                                        permissions: [],
                                                        color: "default"
                                                    }
                                                })
                                            }
                                            message.guild.channels.cache.forEach(channels => {
                                                channels.updateOverwrite(MutedRole, {
                                                    SEND_MESSAGES: false,
                                                    ADD_REACTIONS: false
                                                })
                                            })
                                            targetMuted.roles.add(MutedRole)
                                            message.channel.send(`${targetMuted.user.tag} Succesfuly Muted!`)
                                        } else {
                                            if (message.content.startsWith(prefix + 'clear')) {
                                                if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("You don't have the required presmission `MANAGE_MESSAGES`");


                                                let args = message.content.split(" ").slice(1)
                                                let messagecount = parseInt(args);
                                                if (args > 100) return message.channel.send(`\`\`\`javascript
                                        i cant delete more than 100 messages\`\`\``).then(messages => messages.delete(5000))
                                                if (!messagecount) messagecount = '100';
                                                message.channel.messages.fetch({
                                                    limit: 100
                                                }).then(messages => message.channel.bulkDelete(messagecount)).then(messages => {
                                                    message.channel.send(`\`\`\`javascript\n${messages.size} messages cleared\`\`\``).then(messages =>
                                                        messages.delete({
                                                            timeout: 5000
                                                        }));
                                                })
                                            } else {
                                                if (message.content.startsWith(prefix + 'unmute')) {
                                                    if (!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send("You don't have the required presmission `MUTE_MEMBERS`");
                                                    let member = message.mentions.users.first() || client.users.cache.get(message.content.split(' ')[1])
                                                    let user = message.guild.member(member)
                                                    if (!user) return message.channel.send("Please mention some one")
                                                    if (!message.guild.member(user).bannable) return message.channel.send('I can\'t unmute one higher than me')
                                                    var muteRole = message.guild.roles.cache.find(n => n.name === 'Muted')
                                                    if (!muteRole) {
                                                        message.guild.roles.create({
                                                            data: {
                                                                name: "Muted",
                                                            }
                                                        }).then(async (role) => {
                                                            await message.guild.channels.cache.forEach(channel => {
                                                                channel.overwritePermissions([{
                                                                    id: role.id,
                                                                    deny: ["SEND_MESSAGES"]
                                                                }]);
                                                            })
                                                        })
                                                    }
                                                    user.roles.remove(muteRole)
                                                    message.channel.send(`${user.user.tag} Successfuly Unmuted!`)
                                                } else {
                                                    if (message.content.startsWith(prefix + 'help')) {
                                                        let embed = new Discord.MessageEmbed()
                                                            .addField(`Misc `, '`help`')
                                                            .addField('General Commands ', '`avatar`, `server`, `user`, `startvote`')
                                                            .addField('Moderation ', '`ban`,`kick`, `mute`, `unmute`, `clear`,`hide`, `show`')
                                                            .addField(`Owner commands `, '`blacklist`, `unblacklist`')
                                                            .setColor("RANDOM")
                                                        return message.channel.send(embed)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})
