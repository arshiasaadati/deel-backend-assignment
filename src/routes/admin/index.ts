import express from "express";
import { getProfile } from "../../middleware/getProfile";
import { getBestClients, getBestProfession } from "./admin.controller";

const jobRouter = express.Router();

jobRouter.get("/best-profession", getProfile, getBestProfession);
jobRouter.get("/best-clients", getProfile, getBestClients);

export default jobRouter;
