const { Thought, User } = require("../models");

const thoughtController = {
  // get all Thoughts
  getAllThought(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get Thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
        res.json(thoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create a Thought
  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }

        res.json({ message: "Thought created!" });
      })
      .catch((err) => res.json(err));
  },

  // update Thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(thoughtData);
      })
      .catch((err) => res.json(err));
  },

  // delete a Thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }

        // remove thought id from user's thoughts field
        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }
        res.json({ message: "Thought successfully deleted!" });
      })
      .catch((err) => res.json(err));
  },

  // add a reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No thought with this id" });
          return;
        }
        res.json(thoughtData);
      })
      .catch((err) => res.json(err));
  },

  // delete a reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
