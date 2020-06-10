const {fetchUsers, createNewUser, fetchUserById} = require('../users');
const {RedisPubSub} = require('graphql-redis-subscriptions');
const redis = require('redis');
const subscriber = redis.createClient();
const publisher = redis.createClient();

const USER_ADDED= 'USER_ADDED';

const pubsub = new RedisPubSub({
    publisher,
    subscriber
});
const resolvers = {
    Query: {
        hello: () => 'Hello World',
        users: () => fetchUsers(),
        user: (parent, args) => fetchUserById(args.id)
    },
    Mutation: {
        addNewUser: async (parent, args) => {            
            const user = await createNewUser(args);            
            await pubsub.publish(USER_ADDED, {userAdded: user});
            return user;
    },
},
    Subscription: {
        userAdded: {
            subscribe: () => pubsub.asyncIterator([USER_ADDED])
        }
    },
    User: {
        __resolveType: (user, context, info) => {
            console.log('---user---',user);
            if (user.facebookHandle) {
                return 'NormalUser'
            }
            if (user.email) {
                return 'CorporateUser'
            }
            return 'DefaultUser';
        }
    }
}

module.exports = resolvers;