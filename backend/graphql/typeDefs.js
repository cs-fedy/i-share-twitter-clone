const gql = require("graphql-tag");
module.exports = gql`
  type user {
    token: String
    userID: ID!
    email: String!
    password: String!
    username: String!
    accountCreatedAt: String!
    accountType: String!
    bio: String
    accountUpdatedAt: String
    gender: String
    profilePictURL: String
    country: String
    birthDate: String
  }

  type follow {
    followID: ID!
    follower: String!
    following: String!
    followedAt: String!
  }

  type block {
    blockID: ID!
    blocker: String!
    blocking: String!
    blockedAt: String!
  }

  type comment {  
    commentID: ID!
    postID: ID!
    commentedBy: String!
    commentBody: String!
    commentedAt: String!
    commentUpdatedAt: String
    hidden: Boolean
  }

  type react {
    reactID: ID!
    postID: ID!
    reactedBy: String!
    reactType: String!
    reactedAt: String!
    hidden: Boolean
  }

  type post {
    postID: ID!
    username: String!
    postBody: String!
    postedAt: String!
    postUpdatedAt: String
    commentsCount: Number!
    reactsCount: Number!
  }

  type message {
    messageID: ID!
    dmID: ID!
    username: String!
    messageBody: String!
    sentAt: String!
  }

  type dm {
    dmID: ID!
    messengers: [String]!
    lastMessage: message
    startedDMSince: String!
    hidden: Boolean
  }

  type bookmark {
    bookmarkID: ID!
    username: String!
    postID: ID!
    bookmarkedAt: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input SignupInput {
    email: String!
    username: String!
    password: String!
    confirmPassword: String!
  }

  input UpdatePostInput {
    newPostBody: String!
    postID: ID!
  }

  input ReactInput {
    postID: ID!
    reactType: String!
  }

  input CommentInput {
    commentBody: String!,
    postID: ID!
  }

  input UpdateCommentInput {
    commentID: ID!
    newCommentBody: String!
  }

  input MessageInput {
    messageBody: String!
    dmID: String!
  }

  type Query {
    getUser(userID: ID!): user!
    getPosts(userID: ID): [post]!
    getPost(postID: ID!): post!
    getBookmarks:[bookmark]!
    getMessages(dmID: ID!): [message]!
    getDMs: [dm]!
  }
  
  type Mutation {
    login(loginInput: LoginInput): user!
    signup(signupInput: SignupInput): user!
    deleteAccount: ID!
    toggleFollow(targetUsername: String!): follow!
    toggleBlock(targetUsername: String!): block!
    createPost(postBody: String!): post!
    updatePost(updatePostInput: UpdatePostInput): post!
    deletePost(postID: ID!): ID!
    react(reactInput: ReactInput): react!
    comment(commentInput: CommentInput): comment!
    updateComment(updateCommentInput: UpdateCommentInput): comment!
    deleteComment(commentID: ID!): ID!
    toggleBookmark(postID: ID!): bookmark!
    createMessage(messageInput: MessageInput): message!
    deleteMessage(messageID: ID!): ID!
    deleteDM(dmID: ID!): ID!
    createDM(messengers: [String]!): dm!
  }
`;
