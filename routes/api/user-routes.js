const router = require("express").Router();
const {
  getAllUsers,
  getUserBySingleId,
  createUser,
  updateUsers,
  deleteUsers,
  addFriends,
  removeFriends,
} = require("../../controllers/user-controller");

router.route("/").get(getAllUsers).post(createUser);

router
  .route("/:id")
  .get(getUserBySingleId)
  .put(updateUsers)
  .delete(deleteUsers);

router
  .route("/:userId/friends/:friendId")
  .post(addFriends)
  .delete(removeFriends);

module.exports = router;
