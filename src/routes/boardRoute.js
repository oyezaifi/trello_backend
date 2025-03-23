const express = require("express");
const {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} = require("../controllers/board.controller.js"); // ✅ Correct import

const { protect } = require("../middlewares/auth.middleware.js");
const router = express.Router();

// router.route("/")
//   .post(protect, createBoard)
//   .get(protect, getBoards);

// router.route("/:id")
//   .get(protect, getBoardById)
//   .put(protect, updateBoard)
//   .delete(protect, deleteBoard);

router.post("/create", protect, createBoard);
router.get("/getBoards", protect, getBoards);
router.get("/get/:id", getBoardById);
router.put("/update/:id", updateBoard);
router.delete("/delete/:id", deleteBoard);

module.exports = router;
