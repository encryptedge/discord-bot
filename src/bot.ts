import {
    ApplicationCommandDataResolvable,
    Client,
    Collection,
    Snowflake,
} from 'discord.js'

import './server'

import { loadSlashCommand, loadTextCommand } from './loaders/command'
import { loadDiscordEvent } from './loaders/event'
import type { SlashCommand, TextCommand } from './sturctures/command'
import { hgqlInit } from './utils/database'
import { MusicQueue } from './utils/musicQueue'
import { Command } from './interfaces/Command'

export class Bot {
    public prefix = 'ee!'
    public commands = new Collection<string, Command>()
    public slashCommands = new Array<ApplicationCommandDataResolvable>()
    public slashCommandsMap = new Collection<string, Command>()
    public cooldowns = new Collection<string, Collection<Snowflake, number>>()
    public queues = new Collection<Snowflake, MusicQueue>()

    public constructor(public client: Client) {
        this.client.commands = new Collection()
        this.client.commandsCatagories = new Collection()
        this.client.aliases = new Collection()
        this.client.slashcommands = new Collection()

        loadDiscordEvent(this.client)
        loadTextCommand(this.client)

        hgqlInit()

        this.client.login(process.env.TOKEN)

        this.client.on('ready', () => {
            console.log(`🟢 Logged in as ${client.user?.tag}!`)
            loadSlashCommand(client, process.env.CLIENT_ID, process.env.TOKEN)
        })
    }
}
// declare types.
declare module 'discord.js' {
    export interface Client {
        aliases: Collection<string, string>
        commands: Collection<string, TextCommand>
        slashcommands: Collection<string, SlashCommand>
        commandsCatagories: Collection<string, string[]>
        queues: Collection<Snowflake, MusicQueue>
    }
}
