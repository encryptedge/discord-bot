import { createCanvas, loadImage } from 'canvas'
import { AttachmentBuilder } from 'discord.js'
import GIFEncoder from 'gifencoder'
import { SlashCommandBuilder } from '@discordjs/builders'
import { EmbedBuilder } from 'discord.js'

import type { SlashCommand } from '../../sturctures/command'
import { command as TextCommand } from '../message/images/trigger'

export const command: SlashCommand = {
    slashData: new SlashCommandBuilder()
        .setName('flag')
        .setDescription(TextCommand.data.description),
    run: async ({ interaction }) => {
        const { user: author } = interaction
        const senderAvatar = author.displayAvatarURL({
            size: 256,
            extension: 'png',
            forceStatic: true,
        })

        const targetImage = await loadImage(senderAvatar)
        const background = await loadImage('./assets/flagyellow.jpg')

        const gif: any = new GIFEncoder(256, 310)

        gif.start()
        gif.setRepeat(0)
        gif.setDelay(15)

        const canvas = createCanvas(256, 310)
        const context = canvas.getContext('2d')

        const BR = 30
        const LR = 20

        for (let index = 0; index < 9; index++) {
            context.clearRect(0, 0, 256, 310)
            context.drawImage(
                targetImage,
                Math.floor(Math.random() * BR) - BR,
                Math.floor(Math.random() * BR) - BR,
                256 + BR,
                310 - 54 + BR
            )
            context.fillStyle = '#FF000033'
            context.fillRect(0, 0, 256, 310)
            context.drawImage(
                background,
                Math.floor(Math.random() * LR) - LR,
                310 - 54 + Math.floor(Math.random() * LR) - LR,
                256 + LR,
                54 + LR
            )
            gif.addFrame(context)
        }

        gif.finish()

        const attachment = new AttachmentBuilder(gif.out.getData(), {
            name: `${Date.now()}_trgigered.gif`,
        })

        const embed = new EmbedBuilder().setDescription(
            `Here is your flag!`
        )

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
            files: [attachment],
        })
    },
}
