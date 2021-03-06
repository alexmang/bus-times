// 'use strict';

var Alexa = require("alexa-sdk");
var constants = require('./constants');
var setupEventHandler = require("./SetupEventHandlers")
var APP_ID = constants.appId


var languageStrings = {
        "en-US": {
        "translation": {
            "SKILL_NAME" : "Bus Times",
            "WELCOME_MESSAGE": "Hello, I can give you the time it takes to get somewhere?",
            "DIRECTIONS": "Leave in %s minutes to %s stop to take %s",
            "HELP_MESSAGE": "You can ask for how long it will take to get to a place, for example How long will it take to get from home to pierpont commons?",
            "STOP_MESSAGE": "Goodbye!"  
        }
    }
};




var handlers = {
    'LaunchRequest': function() {
        this.emit(' : tell', this.t("WELCOME_MESSAGE"));
    },
    'SearchDirectionIntent': function() {
        var startLocation;
        if (this.event.request.intent.slots.StartLocation.value == undefined) {
            startLocation = this.attributes['home'];
        } else {
            startLocation = this.event.request.intent.slots.StartLocation.value;
        }

        var endLocation = this.event.request.intent.slots.EndLocation.value;

        // TODO: Check STARTLOC
        var googleMapsClient = require('@google/maps').createClient({
          key: 'AIzaSyCZo7_zRilU2c4UjVIDM2rLCpT-l_g3tpA'
        });

        // var result = "Sorry we can't find your route";
        //TODO: parse initial transit location & total time of trip (when to leave)
        googleMapsClient.directions({
          origin: startLocation,
          destination: endLocation,
          mode: 'transit',
          transit_mode: ['bus']
        }, function(err, response) {
          if (!err) {
            // var depature_time = response.json.routes[0].legs[0].departure_time.text;
            var steps = response.json.routes[0].legs[0].steps;
            var departure_instructions = steps[0].html_instructions;
            var departure_bus = steps[1].transit_details.line.name; // in cities use short_name
            var res = departure_instructions + " at " + response.json.routes[0].legs[0].departure_time.text + " and take " + departure_bus;
            alexa.emit(":tell", res);
          } else {
            // console.log(err)
            // console.log(response.json.results);
            alexa.emit(":tell", "Sorry I couldn't find the route for you.");
            // result = err;
          }
        });


        // TODO: speech output
        // alexa.emit(":tell", result);


    },  

    // "SetLocationIntent": funct ion() {
    //     var location = this.envent.request.intent.slots.PostalAddress;
    //     //TODO: create dataabase to persist location memory
    // }

    'AMAZON.HelpIntent' : function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");

        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent' : function() {
        this.emit(':tell', this.t("STOP_MESSAGE"))
    },
    'AMAZON.StopIntent' : function() {
        this.emit(':tell', this.t("STOP_MESSAGE"))
    }
}

exports.handler = function(event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.dynamoDBTableName = 'BusTimeUsers';
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers,setupEventHandler);
    alexa.execute();
}
