const UserModel = require("../models/users");

class User {
  async getUser(username) {
    return await UserModel.findOne({ username });
  }

  async createUser(user) {
    return await UserModel.create(user);
  }
}

module.exports = new User();
