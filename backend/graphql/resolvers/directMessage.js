//* models
const DM = require("../../models/directMessages");
const Message = require("../../models/messages");
//* utils
const checkAuth = require("../../util/checkAuth");

module.exports = {
  Query: {
    //* GET_MESSAGES: get messages of the same dm
    async getMessages(parent, args, context, info) {
      //* Check if the user has the right to get the dms or not
      const { username } = checkAuth(context);
      const { dmID } = args;
      //* if the dm doesn't exist throw an error
      const dm = await DM.findById(dmID);
      if (!dm) {
        throw new Error("dm does not exist");
      }
      //* if the logged user isn't a part of the dm throw an error
      if (dm.messengers.indexOf(username) < 0) {
        throw new Error("you are not a part of this dm");
      }
      //* fetch and return dm messages
      const result = await Message.find({ dmID });
      return result.reverse().map((msg) => ({
        ...msg._doc,
        messageID: msg._id,
      }));
    },
    async getDMs(parent, args, context, info) {
      //* Check if the user has the right to get the messages or not
      const { username } = checkAuth(context);
      //* get, filter and return dms
      const dms = await DM.find();
      dms.filter(
        (dm) => dm.messengers.indexOf(username) > 0
      );
      return dms.reverse().map((dm) => ({
        ...dm._doc,
        dmID: dm._id,
      }));
    },
  },
  Mutation: {
    //* CREATE_MESSAGE: if the dm doesn't exist create new one and add a new message to the dm
    async createMessage(parent, args, context, info) {
      //* Check if the user has the right to create a message or not
      const { username } = checkAuth(context);
      const {
        messageInput: { messageBody, dmID },
      } = args;
      //* if the dm doesn't exist throw an error
      const dm = await DM.findById(dmID);
      if (!dm) throw new Error("dm does not exist");
      // TODO: make sure that the logged user is a messenger in this dm
      //* create, save and return the new message
      const newMessage = new Message({
        dmID,
        username,
        messageBody,
        sentAt: new Date().toISOString(),
      });
      const result = await newMessage.save();
      return {
        ...result._doc,
        messageID: result._id,
      };
    },
    //* DELETE_MESSAGE: delete a message
    async deleteMessage(parent, args, context, info) {
      //* Check if the user has the right to delete a message or not
      const { username } = checkAuth(context);
      const { messageID } = args;
      //* if the message doesn't exist throw an error
      const message = await Message.findById(messageID);
      if (!message) {
        throw new Error("message does not exist");
      }
      //* if the dm of the message doesn't exist throw an error
      const dm = await DM.findById(message.dmID);
      if (!dm) {
        throw new Error("the dm does not exist");
      }
      //* if the sender of the message isn't the logged user throw an error
      if (message.username !== username) {
        throw new Error("you are not the owner of the message");
      }
      //* remove the message
      await message.remove();
      //* set the previous message as the last sent in the dm
      const prevMessage = await Message.findOne().sort("-created_at");
      //! the resent message is at the bottom, so reverse the result
      dm.lastMessage = {
        ...prevMessage._doc,
        messageID: prevMessage._id,
      };
      await DM.updateOne({ dmID }, dm);
      //* return the deleted message id
      return message._id;
    },
    //* DELETE_DM: if the dm messengers count is 2 delete the dm and all its messages else delete the logged user and his messages from the dm
    async deleteDM(parent, args, context, info) {
      //* Check if the user has the right to delete a dm or not
      const { username } = checkAuth(context);
      const { dmID } = args;
      //* if the dm doesn't exist throw an error
      const dm = await DM.findById(dmID);
      if (!dm) {
        throw new Error("dm does not exist");
      }
      //* if the logged user isn't a part of the dm throw an error
      if (dm.messengers.indexOf(username) < 0) {
        throw new Error("you are not a part of this dm");
      }
      //* if the count of the messengers is 2 remove the whole dm
      if (dm.messengers.length === 2) {
        //* remove the dm
        await DM.remove({ _id: dmID });
        //* remove dm messages
        await Message.remove({ dmID });
      } else {
        //* else remove the logged user from messengers list
        dm.messengers.filter((messenger) => messenger !== username);
        await DM.updateOne({ _id: dmID }, dm);
        console.log(username, dm.messengers);
        //* remove the logged user messages from the dm
        await Message.remove({ dmID, username });
      }
      //* return the dm id
      return dmID;
    },
    //* CREATE_DM: create new dm
    async createDM(parent, args, context, info) {
      //* Check if the user has the right to create a dm or not
      const { username } = checkAuth(context);
      const { messengers } = args;
      // TODO: check if messengers exist or not
      //* if a dm with the same messengers exit, throw an error
      const dms = await DM.find();
      const dmAlreadyExist = dms.find(
        (dm) => dm.messengers.sort() === messengers.sort()
      );
      if (dmAlreadyExist) {
        throw new Error("dm already exist");
      }
      //* create, save and return the new dm
      const newDM = new DM({
        messengers,
        startedDMSince: new Date().toISOString(),
      });
      const result = await newDM.save();
      return {
        ...result._doc,
        dmID: result._id,
      };
    },
  },
};
