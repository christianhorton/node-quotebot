var fs = require("fs");

var debug = true;

if(debug) {
	var client = require('coffea')({
		name: 'network',
    	// host: 'localhost',
    	host: 'irc.gamingirc.net',
    	ssl: false,
    	// port: 5001,
    	port: 6667,
   		nick: 'QuoteBoi',
   		username: 'quoteboi'
	});
} else {
	var client = require('coffea')({
		name: 'network',
    	host: 'localhost',
    	ssl: false,
    	port: 5001,
   		nick: 'QuoteBoi',
   		username: 'quoteboi'
	});
}

// Arrays
var quotes;
var admins; // TODO: Add admins to this array

// dan
try {
  var quotes = require("./quotes.json");
  if(debug) {
  	console.log('Loading quotes.json');
  }
} catch (err) {
  var quotes = [];
  saveDB(quotes); // create db with empty array
}

console.log('Trying to reach server...');

function addQuote(quoteMessage, event) {
	var quoteUser = event.user.nick;
	var quote = {id: quotes.length, message: quoteMessage, user: quoteUser, timestamp: new Date().toLocaleDateString()};
	quotes.push(quote);
	saveDB(quotes);
	event.reply(client.format.bold + client.format.green +'Quote[#'+ quote.id + client.format.green +']'+ client.format.reset + client.format.italic +' - ' + quote.message + client.format.reset +' - (Added by ' + client.format.unhighlight(quote.user) +' on '+ quote.timestamp+')');	
}

function delQuote(quoteId, event) {
	delete(quotes[quoteId]);
	event.reply(client.format.bold + client.format.green +'[Success]' + client.format.reset + ' Deleted Quote #' + quoteId);
	saveDB(quotes); // create db with empty array
}

function getQuote(quoteId, event) {
	var quote = quotes[quoteId];
	if(quote != null) {
		event.reply(client.format.bold + client.format.green +'Quote[#'+ quoteId + client.format.green +']'+ client.format.reset + client.format.italic +' - ' + quote.message + client.format.reset +' - (Added by ' + client.format.unhighlight(quote.user) +' on '+ quote.timestamp+')');	
	} else {
		event.reply(client.format.red + client.format.bold + '[Error]' + client.format.reset +' ID not found.');
	}	
}

function saveDB(data, cb) {
  fs.writeFile("./quotes.json", JSON.stringify(data), cb);
}

function isAdmin(event) {
	var admin = event.user.nick;
	if(admin == 'christian' | admin == 'brenden' | admin == 'dan' | admin == 'Digerati') {
		return true;
	}
	return false;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.on('connect', function (err, event) {
  if(debug) {
  	console.log('Connected to' , event.network);
  }
});

client.on('motd', function (err, event) {
	console.log('Joining channels');
    client.join(['#general'], event.network);
});

client.on('message', function (err, event) {
	var tokens = event.message.split(' ');

	if(tokens[0] == '!quote') {
		if(tokens[1]) {
			switch(tokens[1]) {
				case 'add':
					var quoteMessage = tokens.splice(2).join(' ');
					if(quoteMessage == '') {
						event.reply('Please provide a quote');
					} else {
						addQuote(quoteMessage, event);
					}
				break;
				case 'del':
					if(isAdmin(event)) {
						quoteId = tokens[2];
						delQuote(quoteId, event);
					} else {
						event.reply('This is a admin command. You must be a QuoteBoi admin');
					}
				break;
				/* 
				* !quote get 1
				* Returns: quoteMessage
				*/
				case 'get':
					var quoteId = tokens[2];
					getQuote(quoteId, event);
				break;
				case 'random':
					if(isAdmin(event)) {
						var randomQuoteId = getRandomInt(0, (quotes.length - 1));
						getQuote(randomQuoteId, event);
					}
				break;
				case 'info':
					event.reply('Hello! I am a QuoteBot written in nodejs by Christian.');
				break;
				case 'test':
					if(isAdmin(event.nick)) {
						event.reply('Quotes Added: ' + quotes.length);
						event.reply('Admins: ' + quotes.length);
					}
				break;
			}
		} else {
			event.reply('Usage: !quote add | get | info | (admin: del | test | random)');
		}
	} 
});
