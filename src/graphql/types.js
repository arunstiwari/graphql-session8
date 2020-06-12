const {gql} = require('apollo-server');

const typeDefs = gql`
  type Query {
    users: [User],
    user(id: ID!): User
  }

  type Mutation {
    addNewUser(user: UserInput): User,
  }

  type Subscription {
    userAdded: User
  }

 input UserInput {
   name: String
   age: String
 }
 
  interface User {
    id: ID!
    name: String
    age: String
  }

  type CorporateUser implements User{
    id: ID!
    name: String
    age: String
    email: String
  }

  type NormalUser implements User{
    id: ID!
    name: String
    age: String
    facebookHandle: String
  }

  type DefaultUser implements User{
    id: ID!
    name: String
    age: String
  }

`;

module.exports = typeDefs;