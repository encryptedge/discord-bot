import { createCanvas, loadImage } from 'canvas'
import { AttachmentBuilder } from 'discord.js'

import type { TextCommand } from '../../../sturctures/command'

export const command: TextCommand = {
    data: {
        name: 'rip',
        description: 'R I P.',
        directMessageAllowed: true,
        cooldownInterval: 10 * 1000,
    },
    run: async ({ message, args }) => {
        const { attachments, author, guild, channel } = message

        if (channel.isVoiceBased()) return

        // Image fetching
        let image = attachments.first()?.proxyURL

        for (let index = 0; index < 2; index++) {
            if (image) break

            if (index === 1) {
                image = author.displayAvatarURL({
                    size: 256,
                    extension: 'png',
                    forceStatic: true,
                })
                break
            }

            if (guild && args[0]) {
                if (args[0].length >= 18) {
                    const idMember = guild.members.cache.get(args[0])
                    if (idMember) {
                        image = idMember.user.displayAvatarURL({
                            size: 256,
                            extension: 'png',
                            forceStatic: true,
                        })
                    }
                } else {
                    const username = String(args[0]).toLowerCase()
                    const target = guild.members.cache.find((ur) =>
                        ur.user.username.toLowerCase().includes(username)
                    )
                    if (target) {
                        image = target.user.displayAvatarURL({
                            size: 256,
                            extension: 'png',
                            forceStatic: true,
                        })
                    }
                }
            }
        }

        if (!image) return

        const targetImage = await loadImage(image)
        const background = await loadImage('./assets/rip.jpg')

        const canvas = createCanvas(background.width, background.height)
        const context = canvas.getContext('2d')

        context.drawImage(background, 0, 0, canvas.width, canvas.height)
        context.drawImage(targetImage, 95, 200, 150, 150)

        const attachment = new AttachmentBuilder(canvas.toBuffer(), {
            name: `${Date.now()}_rip.png`,
        })

        await channel.send({
            files: [attachment],
        })
    },
}
