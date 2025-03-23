const express = require("express");
const  {
  createColumn,
  getColumnsByBoard,
  updateColumn,
  deleteColumn,
} = require("../controllers/column.controller.js");
const router = express.Router();

router.route("/")
  .post( createColumn); // Create a new column

router.route("/:boardId")
  .get( getColumnsByBoard); // Get all columns for a board

router.route("/:id")
  .put( updateColumn) // Update a column
  .delete( deleteColumn); // Delete a column

module.exports = router;