import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import setupSwagger from "./swagger.js"; // Import Swagger setup function

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Setup Swagger
setupSwagger(app); 

// Routes import
import userRouter from "./routes/user.routes.js";
import formRouter from "./routes/form.routes.js";
import formSubmissionRouter from "./routes/formSubmission.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";

// Routes declaration
app.use("/api/healthcheck", healthcheckRouter);
app.use("/api/users", userRouter);
app.use("/api/forms", formRouter);
app.use("/api/form-submissions", formSubmissionRouter);

export { app };
