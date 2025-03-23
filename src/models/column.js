const mongoose = require("mongoose");
const columnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    position: { type: Number, required: true }, // Helps maintain order of columns
  },
  { timestamps: true }
);

const Column = mongoose.model("Column", columnSchema);
module.exports = Column;