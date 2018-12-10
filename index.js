require('dotenv').config()
const express = require('express')
const app = express()
const Uber = require('node-uber')
const lyft = require('node-lyft')
const url = require('url')

//Authentication for lyft API
const defaultLyftClient = lyft.ApiClient.instance;

defaultLyftClient.authentications['Client Authentication']
.accessToken = process.env.LYFT_CLIENT_TOKEN

var lyftPublicApi = new lyft.PublicApi()
let opts = {
	'rideType': 'lyft',
	'endLat': 37.759234,
	'endLng': -122.4135125
}

// Get the price estimate for a given route on Lyft
app.get('/api/lyftPriceEstimate',  function(request, response) {
	lyftPublicApi.getCost(37.775304, -122.417522, opts)
		.then((res) => { response.json(res); },
		      (err) => { console.error(err); response.sendStatus(500);});
})

// Get an ETA for a given route on Lyft
app.get('/api/lyftTimeEstimate', function(request, response) {
	lyftPublicApi.getETA(37.775304, -122.417522, opts)
		.then((res) => { response.json(res); },
		      (err) => { console.error(err); response.sendStatus(500);});
})

//Authentication for Uber API
var uber = new Uber({
	client_id: process.env.UBER_CLIENT_ID,
	client_secret: process.env.UBER_CLIENT_SECRET,
	server_token: process.env.UBEr_SERVER_TOKEN,
	redirect_uri: 'http://localhost:3000',
	name: 'Nexus',
	language: 'en_US',
	sandbox: true
})
app.get('/', (req, res) => {
	res.send('HEY!')
})

app.listen(3000, () => console.log('Server running on port 3000'))

// Get the price estimate for a given route on Uber
app.get('/api/uberPriceEstimate', function(request, response) {
	var query = url.parse(request.url).query;
	
	//if(!query || !query.start_address || !query.end_adress){
	//	response.sendStatus(400);
	//} else {
		uber.estimates.getPriceForRouteAsync(37.775304, -122.417522,
			37.759234,-122.4135125)
			.then(function(res) { response.json(res) })
			.error(function(err) { console.error(err); response.sendStatus(500);});
	//}
})

// Get an ETA for a given route on Uber
app.get('/api/uberTimeEstimate', function(request, response) {
	var query = url.parse(request.url).query;

	uber.estimates.getETAForLocationAsync(37.775304, -122.417522)
		.then(function(res) { response.json(res); })
		.error(function(err) { console.error(err); response.sendStatus(500);});
})
