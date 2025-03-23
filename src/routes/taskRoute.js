const  express = require("express");
const {
  createTask,
  getTasksByColumn,
  updateTask,
  moveTask,
  deleteTask,
} = require("../controllers/task.controller.js");
// import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/")
  .post(createTask); // Create a new task

router.route("/:columnId")
  .get( getTasksByColumn); // Get all tasks in a column

router.route("/:id")
  .put( updateTask) // Update a task
  .delete( deleteTask); // Delete a task

router.route("/:id/move")
  .put( moveTask); // Move a task to another column

module.exports = router;