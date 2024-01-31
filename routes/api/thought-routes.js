const router = require("express").Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThoughts,
  deleteThoughts,
  addReactions,
  removeReactions,
} = require("../../controllers/thought-controller");

router.route("/").get(getAllThoughts).post(createThought);

router
  .route("/:id")
  .get(getThoughtById)
  .put(updateThoughts)
  .delete(deleteThoughts);

router.route("/:thoughtId/reactions").post(addReactions);

router.route("/:thoughtId/reactions/:reactionId").delete(removeReactions);

module.exports = router;
