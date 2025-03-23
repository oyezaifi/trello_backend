const express = require("express");
const {
  createTask,

  moveTask,
  getBoardTasks,
} = require("../controllers/task.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");
const checkColumnsExist = require("../middlewares/coloumnCheck.js");

const router = express.Router();

router.post("/create", protect, checkColumnsExist, createTask);
router.get("/board/:boardId", protect, getBoardTasks);
router.put("/:id/move", protect, moveTask);

module.exports = router;
