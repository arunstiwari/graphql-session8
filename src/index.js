const server = require('./app');


server.listen({port: 3100}).then(({url, subscriptionsUrl}) => {
    console.log(`Graphql server is running at port ${url}`);
    console.log(`Graphql server is running at port ${subscriptionsUrl}`);
})