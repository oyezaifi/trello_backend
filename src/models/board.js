const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Board name is required"],
      trim: true,
      minlength: [3, "Board name must be at least 3 characters"],
      maxlength: [50, "Board name cannot exceed 50 characters"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: {
          validator: function (v) {
            return !this.owner.equals(v);
          },
          message: "Owner cannot be a member",
        },
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    background: {
      type: String,
      default: "#ffffff",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for tasks count
boardSchema.virtual("tasksCount").get(function () {
  return this.tasks?.length || 0;
});

// Indexes for faster querying
boardSchema.index({ owner: 1 });
boardSchema.index({ members: 1 });
boardSchema.index({ createdAt: -1 });

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
