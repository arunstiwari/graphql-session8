const {fetchUsers, fetchUsersById, createNewUser} = require('../users');
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
        user: (parent, args, context, info) => fetchUsersById(args.id)
    },
    Mutation: {
        addNewUser: async (parent, args) => {
           const user =  await createNewUser(args.user)
            await pubsub.publish(USER_ADDED, {userAdded: user})
           return user;
        }
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
                return "NormalUser"
            }
            if(user.email){
                return "CorporateUser"
            }
            return "DefaultUser"

            
        }
    }
    
}

module.exports = resolvers;