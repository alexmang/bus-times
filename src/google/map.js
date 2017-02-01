var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCZo7_zRilU2c4UjVIDM2rLCpT-l_g3tpA'
});

googleMapsClient.directions({
  origin: '919 S University Ave, Ann Arbor, MI',
  destination: 'Kroger,Ann Arbor, MI',
  mode: 'transit',
  transit_mode: ['bus']
}, function(err, response) {
  if (!err) {
    var departure_time = response.json.routes[0].legs[0].departure_time.text;

    //find departure stop
    var steps = response.json.routes[0].legs[0].steps;
    var departure_loc = steps[0].html_instructions;
    var departure_bus = steps[1].transit_details.line.name; // in cities use short_name
    console.log(departure_loc)
    console.log(departure_bus)
    // for (var step in steps) {
    //   console.log(step)
    // }

    console.log(departure_time);
  } else {
  	console.log(err);
  	console.log(response.json.results);
  }
});