const Task = require("../models/task");
const Column = require("../models/column");

// Create default columns when board is created
const createDefaultColumns = async (boardId) => {
  const columns = [
    { title: "To Do", board: boardId, position: 0 },
    { title: "In Progress", board: boardId, position: 1 },
    { title: "Done", board: boardId, position: 2 },
  ];
  return Column.insertMany(columns);
};

// Create task with status validation
const createTask = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { boardId, title, description } = req.body;

      if (!boardId) throw new Error("Board ID is required");
      if (!title) throw new Error("Task title is required");

      // Verify board exists
      const board = await mongoose
        .model("Board")
        .findById(boardId)
        .session(session);
      if (!board) throw new Error("Board not found");

      // Get first column
      const column = await mongoose
        .model("Column")
        .findOne({ board: boardId })
        .sort("position")
        .session(session);

      if (!column) throw new Error("No columns found for this board");

      // Get next position in column
      const nextPosition = await mongoose
        .model("Task")
        .countDocuments({ column: column._id })
        .session(session);

      // Create task
      const [task] = await mongoose.model("Task").create(
        [
          {
            title,
            description,
            column: column._id,
            board: boardId,
            position: nextPosition,
            // Include any other fields from req.body if needed
          },
        ],
        { session }
      );

      // Update column with task ID
      await mongoose
        .model("Column")
        .findByIdAndUpdate(
          column._id,
          { $push: { tasks: task._id } },
          { session }
        );

      res.status(201).json({
        success: true,
        data: task,
      });
    });
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
// Move task between columns
const moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newColumnId } = req.body;

    // Validate inputs
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    const newColumn = await Column.findById(newColumnId);
    if (!newColumn) {
      return res.status(404).json({
        success: false,
        error: "Column not found",
      });
    }

    // Remove from old column
    await Column.findByIdAndUpdate(
      task.column,
      { $pull: { tasks: task._id } },
      { new: true }
    );

    // Get new position
    const newPosition = await Task.countDocuments({ column: newColumnId });

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        column: newColumnId,
        position: newPosition,
      },
      { new: true }
    );

    // Add to new column
    await Column.findByIdAndUpdate(
      newColumnId,
      { $push: { tasks: updatedTask._id } },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error("Move task error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

// Get tasks by board with column info
const getBoardTasks = async (req, res) => {
  try {
    const columns = await Column.find({ board: req.params.boardId })
      .populate({
        path: "tasks",
        options: { sort: { position: 1 } },
      })
      .sort("position");

    res.json({
      success: true,
      data: columns,
    });
  } catch (error) {
    console.error("Get board tasks error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = {
  createDefaultColumns,
  createTask,
  moveTask,
  getBoardTasks,
};
