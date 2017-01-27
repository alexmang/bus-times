'use strict';

var Alexa = require("alexa-sdk");
var APP_ID = undefined;


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;

    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute
}

var handlers = {
    'LaunchRequest': function() {
        this.emit(' : tell', this.t("WELCOME_MESSAGE"));
    },
    'DirectionsIntent': function() {
        var startLocation = this.event.request.intent.slots.PostalAddress;
        var endLocation = this.event.request.intent.slots.PostalAddress;

        // TODO: Check STARTLOC
        var googleMapsClient = require('@google/maps').createClient({
          key: 'AIzaSyCZo7_zRilU2c4UjVIDM2rLCpT-l_g3tpA'
        });


        //TODO: parse initial transit location & total time of trip (when to leave)
        googleMapsClient.directions({
          origin: '919 S University Ave, Ann Arbor, MI',
          destination: 'Kroger,Ann Arbor, MI',
          mode: 'transit',
          transit_mode: ['bus']
        }, function(err, response) {
          if (!err) {
            console.log(response)
            console.log(response.json.routes[0].legs[0].steps[0].transit_details.line.name)
            console.log("departure time is : ",response.json.routes[0].legs[0].departure_time.text)

          } else {
            console.log(err)
            console.log(response.json.results);
          }
        });

        // TODO: speech output
        this.emit(":tell", this.t("DIRECTIONS", leaveTime, stopname, busName))

    }

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



var languageStrings = {
        "en-US": {
        "translation": {
            "SKILL_NAME" : "Bus Times",
            "WELCOME_MESSAGE": "Hello, I can give you the time it takes to get somewhere?"
            "DIRECTIONS": "Leave in %s minutes to %s stop to take %s"
            "HELP_MESSAGE": "You can ask for how long it will take to get to a place, for example: How long will it take to get from home to pierpont commons?",
            "STOP_MESSAGE": "Goodbye!",
        }
    }
};