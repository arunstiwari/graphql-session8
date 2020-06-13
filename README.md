### 1. Install the following dependencies
```bash
npm i graphql apollo-server apollo-server-express jsonwebtoken
```

### 2. Setup the Apollo graphql server in  the src/app.js using the code as shown below:
```js
const {ApolloServer} = require('apollo-server');
const typeDefs = require('./graphql/types');
const resolvers = require('./graphql/resolvers');
const jwt = require('jsonwebtoken');

const getLoggedInUser = (req) => {
    const token = req.headers['x-auth-token'];
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            throw new Error('Invalid token');
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req})=> ({
        secret: process.env.JWT_SECRET,
        me: getLoggedInUser(req)
    })
})

module.exports = server;
```
### 3. Now start the graphql server by adding the following line of code in src/index.js
```js
require('dotenv').config();

const server = require('./app');

server.listen({port: 3100}).then(({url, subscriptionsUrl})=> {
    console.log(`Server is running at url ${url}`);
    console.log(`Subscription Server is running at url ${subscriptionsUrl}`);
})
```
### 4. Implement the typeDefs  in src/graphql/types.js as shown below
```js
const {gql} = require('apollo-server');

const typeDefs = gql`
  type Query {
    users: [User],
    user(id: ID!): User
  }

  type Mutation {
    registerUser(user: UserInput): User,
    login(email: String, password: String): String
  }

  type Subscription {
    userAdded: User
  }

 input UserInput {
   name: String
   age: Int
   password: String
   email: String
 }
 
  type User {
    id: ID!
    name: String
    email: String
    age: Int
  }

`;

module.exports = typeDefs;
```

### 5. Now implement the resolver function for each of the query and mutation
```js
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
```
+ Implement the individual handler methods  in the src/users/index.js file as shown below
```js
const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 1000
})

const fetchUsers = async ()=> {
    try {
      const {data} = await instance.get('/users');
      return data;
    } catch (e) {
        throw e;
    }
}

const registerUser = async (args) => {
    console.log('---user registration ----', args);
    
    const {name, age, email, password} = args; 
    try {
     const {data} = await instance.post('/users', {
         name,
         age,
         password,
         email
     })
     return data;
    } catch (e) {
        throw e;
    }
}

const fetchUsersById = async (id) => {
    console.log('--fetchUsersById ---',id);
    
    try {
     const {data} = await instance.get(`/users/${id}`);
       console.log(`--fetchUsersById ---${id}  --data ${data}`);
     return data;
    } catch (e) {
        throw e;
    }
}

const login = async (email, password) => {
    try {
        const {data} = await instance.post('/login', {
            email,
            password
        })
        console.log('---data----',data);
        
        return data.token;
    } catch (e) {
        throw e;
    }
}
 
module.exports = {fetchUsers, fetchUsersById,registerUser, login};
```



{
  "data": {
    "registerUser": {
      "id": "5ee3bf56d995e5775bc84a7b",
      "name": "User110",
      "age": 43,
      "email": "user110@xyz.com"
    }
  }
}