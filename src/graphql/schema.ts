import { buildSchema } from 'graphql'

export default buildSchema(`
    input UserInputData {
        email: String!
        password: String!
        name: String!
    }
    
    input PostInputData {
        title: String!
        imageURL: String!
        content: String!
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
    
    type PostData {
        posts: [Post!]!
        totalPost: Int!
    }
    
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }
    
    type LoggedInUser {
        _id: ID!
        name: String!
        email: String!
    }
    
    type AuthData {
        token: String!
        user: LoggedInUser!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
    }
    
    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(page: Int!): PostData!
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)
