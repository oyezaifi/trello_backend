const express=  require( "express");
const cors= require( "cors");
const dotenv= require( "dotenv");

const connectDB= require( "./config/db.js");
const authRoutes= require( "./routes/authRoute.js");
const boardRoutes= require( "./routes/boardRoute.js");
const columnRoutes= require( "./routes/columnRoute.js");
const taskRoutes= require( "./routes/taskRoute.js");
const errorHandler= require( "./middlewares/error.middleware.js");

dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS


// Database connection
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/tasks", taskRoutes);
// console.log("authRoutes:", authRoutes);
// console.log("boardRoutes:", boardRoutes);
// console.log("columnRoutes:", columnRoutes);
// console.log("taskRoutes:", taskRoutes);
// console.log("errorHandler:", errorHandler);
// Error Handling Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
