import express from "express";
import dotenv from "dotenv";

import bodyParser from "body-parser";
import cors from "cors";

import publicRoutes from "./src/routes/public";
import adminRoutes from "./src/routes/admin";
import userRoutes from "./src/routes/user";
import apiMiddleware from "./src/middleware/apiAuth";
import adminMiddleware from "./src/middleware/adminAuth";
import errorHandler from "./src/middleware/errorHandler";


dotenv.config();
require("./src/config/sequelize");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



app.use(cors());
app.use(bodyParser.json());

app.use("/pub", publicRoutes);
app.use("/api/admin", apiMiddleware, adminMiddleware, adminRoutes);
// app.use('/api/user', apiMiddleware, userRoutes);
app.use("/api/user", userRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


module.exports = app;
