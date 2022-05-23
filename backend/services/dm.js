const DMModel = require("../models/directMessages");
const MessageModel = require("../models/messages");

class DM {
  async getDM(dmID) {
    return await DMModel.findById(dmID);
  }

  async getDMMessages(dmID) {
    return await MessageModel.find({ dmID });
  }

  async getAllDMs() {
    return await DMModel.find();
  }

  async removeDM(dmID) {
    return DMModel.findByIdAndDelete(dmID);
  }

  async createDM(data) {
    return await DMModel.create(data);
  }

  async removeDMMessages(dmID) {
    return MessageModel.deleteMany({ dmID });
  }

  async createMessage(data) {
    return await MessageModel.create(data);
  }

  async getDMMessage(messageID) {
    return await Message.findById(messageID);
  }

  async removeMessage(messageID) {
    return await MessageModel.findByIdAndDelete(messageID);
  }

  async getLastMessage(dmID) {
    //! the resent message is at the bottom, so reverse the result
    return await MessageModel.find({ dmID }).sort("-created_at");
  }
}

module.exports = new DM();
