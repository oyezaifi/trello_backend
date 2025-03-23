const Column = require("../models/column")


// @desc   Create a new column
// @route  POST /api/columns
// @access Private
 const createColumn = async (req, res) => {
  const { name, boardId } = req.body;

  if (!name || !boardId) {
    res.status(400);
    throw new Error("Column name and board ID are required");
  }

  const columnCount = await Column.countDocuments({ board: boardId });

  const column = await Column.create({
    name,
    board: boardId,
    position: columnCount, // Assign position based on existing count
  });

  res.status(201).json(column);
};

// @desc   Get all columns for a board
// @route  GET /api/columns/:boardId
// @access Private
 const getColumnsByBoard = async (req, res) => {
  const columns = await Column.find({ board: req.params.boardId }).sort("position");
  res.json(columns);
};

// @desc   Update a column
// @route  PUT /api/columns/:id
// @access Private
 const updateColumn = async (req, res) => {
  const column = await Column.findById(req.params.id);

  if (!column) {
    res.status(404);
    throw new Error("Column not found");
  }

  column.name = req.body.name || column.name;
  await column.save();

  res.json(column);
};

// @desc   Delete a column
// @route  DELETE /api/columns/:id
// @access Private
const deleteColumn = async (req, res) => {
  const column = await Column.findById(req.params.id);

  if (!column) {
    res.status(404);
    throw new Error("Column not found");
  }

  // Delete all tasks in this column before deleting the column itself
  await Task.deleteMany({ column: column._id });

  await column.deleteOne();
  res.json({ message: "Column and its tasks deleted successfully" });
};

module.exports = { createColumn, getColumnsByBoard, updateColumn, deleteColumn };