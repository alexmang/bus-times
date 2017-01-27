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
  	console.log(response)
  	console.log(response.json.routes[0].legs[0].steps[0].transit_details.line.name)
  	console.log("departure time is : ",response.json.routes[0].legs[0].departure_time.text)

  } else {
  	console.log(err)
  	console.log(response.json.results);
  }
});