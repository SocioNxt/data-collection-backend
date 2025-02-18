import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import setupSwagger from "./swagger.js";

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.options("*", cors());


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
