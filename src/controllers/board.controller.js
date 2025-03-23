const Board = require ("../models/board");


// @desc   Create a new board
// @route  POST /api/boards
// @access Private
 const createBoard = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Board name is required");
  }

  const board = await Board.create({
    name,
    owner: req.user._id,
    members: [req.user._id], // Owner is also a member
  });

  res.status(201).json(board);
};

// @desc   Get all boards for a user
// @route  GET /api/boards
// @access Private
 const getBoards = async (req, res) => {
  const boards = await Board.find({ members: req.user._id });
  res.json(boards);
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