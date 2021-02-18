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
    userPosts: [post]!
    userBookmarks: [bookmark]!
    userFollowings: [follow]!
    userFollowers: [follow]!
  }

  type follow {
    followID: ID!
    follower: String!
    following: String!
    followedAt: String!
  }

  type comment {  
    commentID: ID!
    postID: ID!
    commentedBy: String!
    commentBody: String!
    commentedAt: String!
    commentUpdatedAt: String
  }

  type react {
    reactID: ID!
    postID: ID!
    reactedBy: String!
    reactedAt: String!
  }

  type post {
    postID: ID!
    username: String!
    postBody: String!
    postedAt: String!
    postUpdatedAt: String
    originalPostID: ID
    postReacts: [react]!
    postComments: [comment]!
    reposts: [post]!
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
    messengerOne: String!
    messengerTwo: String!
    startedDMSince: String!
    lastMessage: message
  }

  type bookmark {
    bookmarkID: ID!
    username: String!
    postID: ID!
    bookmarkedAt: String!
  }

  input GetFollowInput {
    username: String
    type: String!
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
    getUser(userID: ID): user!
    getPosts: [post]!
    getPost(postID: ID!): post!
    getBookmarks:[bookmark]!
    getMessages(dmID: ID!): [message]!
    getDMs: [dm]!
  }
  
  type Mutation {
    login(loginInput: LoginInput): user!
    signup(signupInput: SignupInput): user!
    toggleFollow(targetUsername: String!): follow!
    createPost(postBody: String!): post!
    updatePost(updatePostInput: UpdatePostInput): post!
    deletePost(postID: ID!): ID!
    react(postID: ID!): react!
    comment(commentInput: CommentInput): comment!
    updateComment(updateCommentInput: UpdateCommentInput): comment!
    deleteComment(commentID: ID!): ID!
    sharePost(postID: ID!): post!
    toggleBookmark(postID: ID!): bookmark!
    createMessage(messageInput: MessageInput): message!
    deleteMessage(messageID: ID!): ID!
    deleteDM(dmID: ID!): ID!
    createDM(messengers: [String]!): dm!
  }

  type Subscription {
    postAdded: post!
  }
`;
