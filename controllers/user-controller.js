const { User, Thought } = require("../models");

const usersController = {
  async getAllUsers(req, res) {
    try {
      const userData = await User.find().select("-__v");

      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async getUserBySingleId(req, res) {
    try {
      const userData = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("friends")
        .populate("thoughts");

      if (!userData) {
        return res.status(404).json({ message: "No user with that id!" });
      }

      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async updateUsers(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $set: req.body,
        },
        {
          runValidators: true,
          new: true,
        }
      );

      if (!userData) {
        return res.status(404).json({ message: "No user with that id!" });
      }

      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async deleteUsers(req, res) {
    try {
      const userData = await User.findOneAndDelete({
        _id: req.params.userId,
      });

      if (!userData) {
        return res.status(404).json({ message: "No user with that id!" });
      }

      await Thought.deleteMany({ _id: { $in: userData.thoughts } });
      res.json({ message: "User and thoughts deleted associated by user id!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async addFriends(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!userData) {
        return res.status(404).json({ message: "No user with that id!" });
      }

      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async removeFriends(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!userData) {
        return res.status(404).json({ message: "No user with that id!" });
      }

      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
module.exports = usersController;
