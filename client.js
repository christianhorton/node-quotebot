

var config = require('./config.json');
var quotes = require('./quotes.json');

var quoteArray = [];
var quoteId = 0;

quote.push({id: 0, message: "test quote 0", user: "christian", timestamp: Date.now()});
quote.push({id: 1, message: "test quote 1", user: "dan", timestamp: Date.now()});

var client = require('coffea')({
	name: 'network',
    host: 'irc.gamingirc.net',
    ssl: false,
    port: 6667,
   	nick: 'Quoter',
   	username: 'quoter'
});


console.log("Connecting to ...");

function addQuote(quoteMessage, event) {
	var quoteUser = event.user;
	var quoteTokens = quoteMessage.split('|');


	event.reply('Added Quote[#<random number>]: ' + quoteMessage + ' -');
}

function deleteQuote(quoteId, event) {
	var quoteUser = event.user;
	event.reply('Deleted Quote[#<random number>]');	
}

function getQuote(quoteId, event) {
	var quoteUser = event.user;

	event.reply('Quote[#<random number>]');	
}

client.on('motd', function (err, event) {
    client.join(['#general'], event.network);
});

client.on('message', function (err, event) {
	var tokens = event.message.split(' ');

	if(tokens[0] == '!quote') {
		if(tokens[1]) {
			switch(tokens[1]) {
				case 'add':
					var quoteMessage = tokens.splice(2);
					addQuote(quoteMessage);
				break;
				case 'del':
					var quoteId = tokens[2];
					if(quoteId) {
						deleteQuote(quoteId, event);
					} else {
						event.reply('Please provide a quote Id');
					}
				break;

				/*
				* !quote get 1
				* Returns: quoteMessage
				*/
				case 'get':

				break;
				case 'info':
					event.reply('Hello! I am a QuoteBot written in nodejs by Christian.');
				break;
				case 'test':
					event.reply('Hello! I am a QuoteBot written in nodejs by Christian.');
				break;
			}
		} else {
			event.reply('Usage: !quote add | del | get | info');
		}
	} 
});
