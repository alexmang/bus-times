var Alexa = require('alexa-sdk');
var constants = require('./constants');

var SetupEventHandler = {

	'SetHomeLocationIntent' : function () {
		this.attributes['home'] = this.event.request.intent.slots.HomeLocation.value;

		this.emit(':tell', "Okay, your home location has been set to" + this.attributes['home'].toString());
    },
}

module.exports = SetupEventHandler;