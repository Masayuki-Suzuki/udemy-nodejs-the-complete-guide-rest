import { buildSchema } from 'graphql'

export default buildSchema(`
    input UserInputData {
        email: String!
        password: String!
        name: String!
    }
    
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageURL: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }
    
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }
    
    type AuthData {
        token: String!
        userId: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }
    
    type RootQuery {
        login(email: String!, password: String!): AuthData!
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)
