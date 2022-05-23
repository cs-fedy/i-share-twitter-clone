const FollowModel = require("../models/follows");
class Follow {
  async getFollow(user, targetUser) {
    return await FollowModel.findOne({
      follower: user,
      following: targetUser,
    });
  }

  async get(condition) {
    return await FollowModel.find(condition)
  } 

  async removeFollow(followId) {
    return await FollowModel.findByIdAndDelete(followId);
  }

  async createFollow(username, targetUsername) {
    return await FollowModel.create({
      follower: username,
      following: targetUsername,
      followedAt: new Date().toISOString(),
    });
  }

  async getUserFollowings(username) {
    return await FollowModel.find({ follower: username })
  }

  async getUserFollowers(username) {
    return await FollowModel.find({ following: username })
  }
}

module.exports = new Follow();
