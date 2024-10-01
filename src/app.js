const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/database");
const userRoutes = require("./routes/user");
const loanRoutes = require("./routes/loan");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Connect to MongoDB for tests
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/loans", loanRoutes);

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Loan Management API",
      version: "1.0.0",
      description: "API documentation for Loan Management System",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
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
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;

if (require.main === module) {
  (async () => {
    await connectDB(); // Connect to MongoDB first
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })();
}
