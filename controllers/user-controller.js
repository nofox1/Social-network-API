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
  createUser({ body }, res) {
    User.create(body)
      .then((userData) => res.json(userData))
      .catch((err) => res.json(err));
  },
  updateUsers({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(userData);
      })
      .catch((err) => res.json(err));
  },
  deleteUsers({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        return Thought.deleteMany({ _id: { $in: userData.thoughts } });
      })
      .then(() => {
        res.json({ message: "User and thoughts deleted!" });
      })
      .catch((err) => res.json(err));
  },
  addFriends({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "No user with this id" });
          return;
        }
        res.json(userData);
      })
      .catch((err) => res.json(err));
  },
  removeFriends({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        res.json(userData);
      })
      .catch((err) => res.json(err));
  },
};
module.exports = usersController;
