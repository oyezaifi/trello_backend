// migrations/finalFixColumns.js
const mongoose = require("mongoose");
const Column = require("./models/column");
const Board = require("./models/board");
async function finalColumnFix() {
  await mongoose.connect(
    "mongodb+srv://huzaifa:arena2k16%40@huzaifa.f4njh.mongodb.net/trelloDB?retryWrites=true&w=majority"
  );

  // Delete all columns without board reference
  await Column.deleteMany({ board: { $exists: false } });
  console.log("Deleted all columns without board reference");

  // Recreate columns for all boards
  const boards = await mongoose.model("Board").find();

  for (const board of boards) {
    const existingColumns = await Column.find({ board: board._id });

    if (existingColumns.length === 0) {
      await Column.insertMany([
        { title: "To Do", board: board._id, position: 0 },
        { title: "In Progress", board: board._id, position: 1 },
        { title: "Done", board: board._id, position: 2 },
      ]);
      console.log(`Created columns for board ${board._id}`);
    }
  }

  await mongoose.disconnect();
}

finalColumnFix().catch(console.error);
