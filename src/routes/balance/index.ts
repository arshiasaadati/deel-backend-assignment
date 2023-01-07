import express from "express";
import { getProfile } from "../../middleware/getProfile";
import { deposit } from "./balance.controller";

const balanceRouter = express.Router();

balanceRouter.post("/deposit/:userId", getProfile, deposit);

export default balanceRouter;
