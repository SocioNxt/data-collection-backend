import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

// Swagger configuration
const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Data Collection Backend",
        version: "1.0.0",
        description: "API documentation for your backend project",
      },
      servers: [
        {
          url: "https://data-collection-backend-three.vercel.app/",
          description: "Production Server",
        },
        {
          url: "http://localhost:8000",
          description: "Local Development Server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./src/routes/*.js"], // Path to your route files
  };
  
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://data-collection-admin-mettasocial.vercel.app",
  "https://data-collection-admin-fl7163qq4.vercel.app"
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

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { app };
