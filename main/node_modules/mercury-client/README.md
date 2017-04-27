# mercury-client

## Overview
This is a simple Node library library to consume the [Mercury web parser].
## Installation
First, get an API key at: https://mercury.postlight.com/web-parser/
```
npm install mercury-client --save
```
## Usage
```
const MercuryClient = require('mercury-client')
const mc = new MercuryClient(YOUR_API_KEY_HERE)
mc.parse('https://trackchanges.postlight.com/building-awesome-cms-f034344d8ed')
    .then((data) => { console.log('data', data) } )
    .catch((e) => { console.log('error', e)} )
```
[Mercury web parser]: https://mercury.postlight.com/web-parser/
