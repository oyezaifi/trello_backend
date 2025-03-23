const Board = require("../models/board");
const Column = require("../models/column");
const { createDefaultColumns } = require("./task.controller");
const mongoose = require("mongoose");
const createBoard = async (req, res) => {
  try {
    // Validate input
    const { name } = req.body;
    if (!name?.trim()) throw new Error("Board name is required");

    // Create board without members since owner can't be a member
    const board = await mongoose.model("Board").create({
      name: name.trim(),
      owner: req.user._id,
      members: [], // Empty members array
    });

    console.log("Created board with ID:", board._id);
    console.log("Board ID type:", typeof board._id);

    // Let's manually create columns to avoid any issues
    const columnData = [
      { title: "To Do", board: board._id, position: 0, tasks: [] },
      { title: "In Progress", board: board._id, position: 1, tasks: [] },
      { title: "Done", board: board._id, position: 2, tasks: [] },
    ];

    // Use insertMany directly with Column model
    const columns = await mongoose.model("Column").insertMany(columnData);

    console.log("Columns created:", columns.length);

    // Update board with column IDs
    await mongoose.model("Board").findByIdAndUpdate(board._id, {
      $set: { columns: columns.map((c) => c._id) },
    });

    res.status(201).json({
      success: true,
      data: {
        ...board.toObject(),
        columnsCount: columns.length,
        membersCount: 0,
        tasksCount: 0,
      },
    });
  } catch (error) {
    console.error("Board creation error:", error);
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      success: false,
      error: error.message,
    });
  }
};
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      success: true,
      count: boards.length,
      data: boards.map((board) => ({
        _id: board._id,
        name: board.name,
        owner: board.owner,
        members: board.members,
        tasksCount: board.tasksCount || 0,
        createdAt: board.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get boards error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc   Get a single board by ID
// @route  GET /api/boards/:id
// @access Private
const getBoardById = async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  // Check if user is a member of the board
  if (!board.members.includes(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to access this board");
  }

  res.json(board);
};

// @desc   Update a board
// @route  PUT /api/boards/:id
// @access Private
const updateBoard = async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this board");
  }

  board.name = req.body.name || board.name;
  await board.save();

  res.json(board);
};

// @desc   Delete a board
// @route  DELETE /api/boards/:id
// @access Private
const deleteBoard = async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this board");
  }

  await board.deleteOne();
  res.json({ message: "Board deleted successfully" });
};

// module.exports = { createBoard, getBoards, getBoardById, updateBoard, deleteBoard };
module.exports = {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
};
