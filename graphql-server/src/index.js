require('dotenv').config();

const server = require('./app');

server.listen({port: 3100}).then(({url, subscriptionsUrl})=> {
    console.log(`Server is running at url ${url}`);
    console.log(`Subscription Server is running at url ${subscriptionsUrl}`);
})