// routes/columnRoutes.js
const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { getBoardColumns } = require("../controllers/column.controller");
const router = express.Router();

router.get("/board/:boardId", protect, getBoardColumns);

module.exports = router;
