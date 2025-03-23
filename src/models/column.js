const mongoose = require("mongoose");
const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Column title is required"],
      enum: ["To Do", "In Progress", "Done"],
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: [true, "Board reference is required"],
      index: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    position: {
      type: Number,
      required: [true, "Position is required"],
      min: 0,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);
module.exports = mongoose.model("Column", columnSchema);
