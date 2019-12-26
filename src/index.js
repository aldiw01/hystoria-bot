require('dotenv/config')

const Telegraf = require('telegraf')
const axios = require('axios')

const bot = new Telegraf(process.env.APP_BOT_TOKEN)

/////////////////////////////////////////////////////////////////////////////////////////////
// Start Command

bot.start((ctx) => {
	ctx.reply('Welcome!, ' + ctx.message.chat.first_name)
	req = {
		id: ctx.message.chat.id,
		first_name: ctx.message.chat.first_name,
		last_name: ctx.message.chat.last_name,
		username: ctx.message.chat.username
	}
	axios.post(process.env.APP_SERVER_API + 'user', req)
		.then(res => {
			ctx.reply(res.data.message)
		})
})

/////////////////////////////////////////////////////////////////////////////////////////////
// Earning Command

bot.command('newearn', (ctx) => {
	text = ctx.message.text.replace("/newearn ", "")
	lastParameter = text.indexOf(" ")
	req = {
		user_id: ctx.message.chat.id,
		nominal: text.slice(0, lastParameter),
		description: text.slice(lastParameter + 1)
	}
	axios.post(process.env.APP_SERVER_API + 'earning', req)
		.then(res => {
			ctx.reply(res.data.message)
		})
})

bot.command('lastearn', (ctx) => {
	reply = "Last 5 Earnings Report\n\n"
	total = 0
	axios.get(process.env.APP_SERVER_API + 'earning')
		.then(res => {
			for (i = 0; i < res.data.length; i++) {
				reply += "ID : " + res.data[i].id + "\n"
				reply += "Nominal : Rp. " + res.data[i].nominal + "\n"
				reply += "Description : " + res.data[i].description + "\n"
				reply += "Created : " + new Date(res.data[i].created).toLocaleString('en-GB') + "\n"
				reply += "------------------------------------------------\n"
				total += parseInt(res.data[i].nominal)
			}
			reply += "\nTotal Earnings : " + total
			console.log(res.data)
			ctx.reply(reply)
		})
})

bot.command('editearnnominal', (ctx) => {
	text = ctx.message.text.replace("/editearnnominal ", "")
	lastParameter = text.indexOf(" ")
	id = text.slice(0, lastParameter)
	req = {
		user_id: ctx.message.chat.id,
		nominal: text.slice(lastParameter + 1)
	}
	axios.put(process.env.APP_SERVER_API + 'earning/nominal/' + id, req)
		.then(res => {
			ctx.reply(res.data.message)
		})
})

bot.command('editearndesc', (ctx) => {
	text = ctx.message.text.replace("/editearndesc ", "")
	lastParameter = text.indexOf(" ")
	id = text.slice(0, lastParameter)
	req = {
		user_id: ctx.message.chat.id,
		description: text.slice(lastParameter + 1)
	}
	axios.put(process.env.APP_SERVER_API + 'earning/description/' + id, req)
		.then(res => {
			ctx.reply(res.data.message)
		})
})

bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('Hi', (ctx) => ctx.reply('Hey there'))
bot.on('message', (ctx) => {
	ctx.reply('Hello')
	console.log(ctx.message)
})
bot.command('modern', ({ reply }) => reply('Yo'))
bot.command('hipster', Telegraf.reply('λ'))

bot.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log('Response time: %sms', ms)
})

bot.on('text', (ctx) => ctx.reply('Hello World'))

// bot.telegram.sendMessage(758713395, "Test send chat\n\nAldi")

try {
	bot.launch()
	console.log("Bot is alive ...")
} catch (e) {
	console.log(e)
}