const MercuryClient = require('./index.js')

let apiKey = process.env.MERCURY_API_KEY
const mc = new MercuryClient(apiKey)

mc.parse('https://trackchanges.postlight.com/building-awesome-cms-f034344d8ed')
.then((data) => { console.log('data', data) })
.catch((e) => { console.log('error', e) })
