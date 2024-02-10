const router = require("express").Router();
const {
  getThoughts,
  getSingleThoughtById,
  createThought,
  updateThought,
  deleteThoughts,
  addReactions,
  removeReactions,
} = require("../../controllers/thought-controller");

router.route("/").get(getThoughts).post(createThought);

router
  .route("/:id")
  .get(getSingleThoughtById)
  .put(updateThought)
  .delete(deleteThoughts);

router.route("/:thoughtId/reactions").post(addReactions);

router.route("/:thoughtId/reactions/:reactionId").delete(removeReactions);

module.exports = router;
