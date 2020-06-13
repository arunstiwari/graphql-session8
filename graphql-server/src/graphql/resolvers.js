const {fetchUsers, fetchUsersById, registerUser,login} = require('../users');
const {RedisPubSub} = require('graphql-redis-subscriptions');
const redis = require('redis');
const publisher = redis.createClient();
const subscriber = redis.createClient();

const pubsub = new RedisPubSub({
    publisher,
    subscriber
})
const USER_ADDED = 'USER_ADDED';
const resolvers = {
    Query: {
        users: () => fetchUsers(),
        user: (parent, args, context, info) => {
            const {me} = context;
            console.log('--me---',me);
            //Now you get the context of user and you can do thing as you want
            const user = fetchUsersById(args.id);
            return user;
        }
    },
    Mutation: {
        registerUser: async (parent, args) => {
            console.log('---registerUser mutation ---',args);
            
           const user =  await registerUser(args.user)
            await pubsub.publish(USER_ADDED, {userAdded: user})
           return user;
        },
        login: async (parent, {email, password}) => {
            const token = await login(email, password);
            return token;
        }
    },
    Subscription: {
        userAdded: {
            subscribe: () => pubsub.asyncIterator([USER_ADDED])
        }
    },    
}

module.exports = resolvers;