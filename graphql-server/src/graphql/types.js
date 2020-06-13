const {gql} = require('apollo-server');

const typeDefs = gql`
  type Query {
    users: [User] ,
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