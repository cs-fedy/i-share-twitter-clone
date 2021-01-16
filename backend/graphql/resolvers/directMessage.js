//* models
const DM = require("../../models/directMessages");
const Message = require("../../models/messages");
//* utils
const checkAuth = require("../../util/checkAuth");
const user = require("./user");

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
      if (dm.messengers.indexOf(username) < 1) {
        throw new Error("you are not a part of this dm");
      }
      //* if the dm is hidden throw an error
      if (dm.hidden) {
        throw new Error("the dm is hidden");
      }
      //* fetch and return dm messages
      return (await Message.find({ dmID }))
      .map(msg => ({
        ...msg._doc,
        messageID: msg._id,
      }));
    },
    async getDMs(parent, args, context, info) {
      //* Check if the user has the right to get the messages or not
      const { username } = checkAuth(context);
      //* get, filter and return dms
      const dms = await DM.find((dm) => dm.messengers.indexOf(username) > 0);
      return dms.map((dm) => {
        if (!dm.hidden) {
          return {
            ...dm._doc,
            dmID: dm._id,
          };
        }
      });
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
      if (!dm) {
        throw new Error("dm does not exist");
      }
      //* create and save the new message
      const newMessage = new Message({
        dmID,
        username,
        messageBody,
        sentAt: new Date().toISOString(),
      });
      const result = await newMessage.save();
      //* mark the new message as the last sent in the dm
      dm.lastMessage = {
        ...result._doc,
        messageID: result._id
      }
      await DM.updateOne({ dmID }, dm);
      //* return the new created message
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
        throw new Error('message does not exist');
      }
      //* if the dm of the message doesn't exist throw an error
      const dm = await DM.findById(message.dmID);
      if (!dm) {
        throw new Error('the dm does not exist');
      }
      //* if the sender of the message isn't the logged user throw an error
      if (message.username !== username) {
        throw new Error('you are not the owner of the message');
      }
      //* remove the message
      await message.remove();
      //* set the previous message as the last sent in the dm
      const prevMessage = await Message.find().limit(1);
      //! the resent message is at the top
      dm.lastMessage = {
        ...prevMessage._doc,
        messageID: prevMessage._id
      }
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
        throw new Error('dm does not exist');
      }
      //* if the logged user isn't a part of the dm throw an error
      if (dm.messengers.indexOf(username) < 1) {
        throw new Error('you are not a part of this dm');
      }
      //* if the count of the messengers is 2 remove the whole dm
      if (dm.messengers.length === 2) {
        //* remove the dm
        await dm.remove();
        //* remove dm messages
        await Message.remove({ dmID });
      } else {
        //* else remove the logged user from messengers list
        dm.messengers.filter(messenger => messenger !== username);
        await dm.update();
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
      //* if a dm with the same messengers exit, throw an error
      const dmAlreadyExist = await DM.find(dm => dm.messengers.sort() === messengers.sort());
      if (dmAlreadyExist) {
        throw new Error('dm already exist');
      }
      //* create, save and return the new dm
      const newDM = new DM({
        messengers,
        startedDMSince: new Date().toISOString()
      });
      const result = await newDM.save();
      return {
        ...result._doc,
        dmID: result._id
      }
    }
  },
};
