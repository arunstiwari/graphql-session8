const {fetchUsers, createNewUser, fetchUserById} = require('../users');

const resolvers = {
    Query: {
        hello: () => 'Hello World',
        users: () => fetchUsers(),
        user: (parent, args) => fetchUserById(args.id)
    },
    Mutation: {
        addNewUser: (parent, args) => createNewUser(args)
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