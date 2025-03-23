// middlewares/columnCheck.js
const { createDefaultColumns } = require("../controllers/task.controller");
const Column = require("../models/column");

const checkColumnsExist = async (req, res, next) => {
  try {
    const columnCount = await Column.countDocuments({
      board: req.params.boardId,
    });

    if (columnCount === 0) {
      // Auto-create columns if missing (optional safety net)
      await createDefaultColumns(req.params.boardId);
      return next();
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkColumnsExist;
