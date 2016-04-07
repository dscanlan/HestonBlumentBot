'use strict';
var Botkit = require('botkit');
var google = require('google');

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: 'xoxb-28805144033-gqL0xLzb9x4fZ5W6DDuNKfC6',
}).startRTM();


var recipes = [];
var index= 0;

var nextRecipe = function(reponse, conv){
	conv.ask('Ok how about ' + recipes[index].title + ' . Any good?', function(response, conv){
		if(response.text ==='Yes' || response.text ==='yes'){
			conv.say('Here\s the link\n' + recipes[index].href + '\n' + recipes[index].description);
		}
		else{
			nextRecipe(response, conv);
		}
		
		
		conv.next();
	});
};

var conversation = function(response, conv){
	conv.ask('I\ve found a recipe for ' + recipes[index].title + '. Any good?', function(response, conv){
		if(response.text ==='Yes' || response.text ==='yes'){
			conv.say('Here\s the link\n' + recipes[index].href + '\n' + recipes[index].description);
		}
		else{
			index++;
			nextRecipe(response, conv);
		}
		
		
		conv.next();
	});
};

var doSearch = function(response, conv, str){
	google('food recipe ' + str, function (err, res){
	  if (err){ 
	  		console.error(err);
	  }



	  if(res.links.length > 0){
	  	recipes = res.links;
	  	console.log('found ' + res.links.length);
	  	conversation(response, conv);
	  }
	  else{
	  	conv.say('Booooo I\ve found anything!');
	  }
	  	

	  
	 
	  /*for (var i = 0; i < res.links.length; ++i) {
	    var link = res.links[i];
	    console.log(link.title + ' - ' + link.href)
	    console.log(link.description + "\n");
	  }
	 
	  if (nextCounter < 4) {
	    nextCounter += 1
	    if (res.next){
	    	res.next();	
	    } 
	  }*/
	});
};


var askIngredients = function(response, conv){
	conv.ask('What Ingredients have you got?', function(response, conv){
		conv.say(response.text + '? Great.');

		things.push(response.text);
		anyMore(response, conv);
		conv.next();
	});
};

var askIngredientMore = function(response, conv){
	conv.ask('Anything else?', function(response, conv){
		conv.say(response.text + '? Great.');

		things.push(response.text);
		anyMore(response, conv);
		conv.next();
	});
};

var anyMore = function(response, conv){
	conv.ask('Anything else?', function(response, conv){
		if(response.text ==='No' || response.text ==='no'){
			var str = '';
			for(var i = 0; i < things.length; i++){
				str = str  + ' ' + things[i];
			}
			conv.say('Ok, great! I\'ve got' + str );
			doSearch(response, conv, str);
		}
		else{
			conv.say('uh-huh.');
			askIngredientMore(response, conv);
		}
		conv.next();
	});
};


var things = [];

// give the bot something to listen for.
controller.hears('hello',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,'Hello yourself.');
});

controller.hears(['find recipe'],['ambient'],function(bot,message) {
	bot.startConversation(message, askIngredients);
	/*bot.startConversation(message,function(err,convo) {

	    convo.ask('How are you?',function(response,convo) {

	      	convo.say('Cool, you said: ' + response.text);
	      	convo.next();
	    });
  	});*/
});