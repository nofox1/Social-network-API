const { Thought, User } = require("../models");

const thoughtController = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughtData = await Thought.find().sort({ createdAt: -1 });

      res.json(thoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async getSingleThoughtById(req, res) {
    try {
      const thoughtData = await Thought.findOne({
        _id: req.params.thoughtId,
      });

      if (!thoughtData) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      res.json(thoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async createThought(req, res) {
    try {
      const thoughtData = await Thought.create(req.body);

      const userData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );

      if (!userData) {
        return res.status(404).json({
          message: "Thought created but didn't find a user with this id!",
        });
      }

      res.json({ message: "Thought created!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async updateThought(req, res) {
    const thoughtData = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!thoughtData) {
      return res.status(404).json({ message: "No thought with this id!" });
    }

    res.json(thoughtData);

    console.log(err);
    res.status(500).json(err);
  },
  async deleteThoughts(req, res) {
    try {
      const thoughtData = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!thoughtData) {
        return res.status(404).json({ message: "No thought with that id!" });
      }
      const userData = User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!userData) {
        return res.status(404).json({
          message: "Thought created but didn't find a user with this id!",
        });
      }

      res.json({ message: "Thought deleted!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async addReactions(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thoughtData) {
        return res.status(404).json({ message: "No thought with that id!" });
      }

      res.json(thoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async removeReactions(req, res) {
    try {
      const ThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!ThoughtData) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      res.json(ThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
