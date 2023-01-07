import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./model";
import contractRouter from "./routes/contract";
import jobRouter from "./routes/job";
import balanceRouter from "./routes/balance";
import adminRouter from "./routes/admin";

const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.use("/contracts", contractRouter);
app.use("/jobs", jobRouter);
app.use("/balances", balanceRouter);
app.use("/admin", adminRouter);

export default app;
