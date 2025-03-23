const Task = require("../models/task.js");
// import Column from "../models/column.model.js";


// @desc   Create a new task
// @route  POST /api/tasks
// @access Private
const createTask = async (req, res) => {
  const { title, description, columnId, boardId, dueDate, priority } = req.body;

  if (!title || !columnId || !boardId) {
    res.status(400);
    throw new Error("Task title, column ID, and board ID are required");
  }

  const taskCount = await Task.countDocuments({ column: columnId });

  const task = await Task.create({
    title,
    description,
    column: columnId,
    board: boardId,
    dueDate,
    priority,
    position: taskCount, // Assign position based on existing count
  });

  res.status(201).json(task);
};

// @desc   Get all tasks for a column
// @route  GET /api/tasks/:columnId
// @access Private
 const getTasksByColumn = async (req, res) => {
  const tasks = await Task.find({ column: req.params.columnId }).sort("position");
  res.json(tasks);
};

// @desc   Update a task
// @route  PUT /api/tasks/:id
// @access Private
 const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.dueDate = req.body.dueDate || task.dueDate;
  task.priority = req.body.priority || task.priority;

  await task.save();

  res.json(task);
};

// @desc   Move a task to another column
// @route  PUT /api/tasks/:id/move
// @access Private
 const moveTask = async (req, res) => {
  const { newColumnId, newPosition } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.column = newColumnId;
  task.position = newPosition;

  await task.save();

  res.json({ message: "Task moved successfully", task });
};

// @desc   Delete a task
// @route  DELETE /api/tasks/:id
// @access Private
 const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();
  res.json({ message: "Task deleted successfully" });
};
module.exports = { createTask, getTasksByColumn, updateTask, moveTask, deleteTask };