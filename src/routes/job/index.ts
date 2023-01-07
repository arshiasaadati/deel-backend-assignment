import express from "express";
import { getProfile } from "../../middleware/getProfile";
import { getUnpaidJobs, payForJob } from "./job.controller";

const jobRouter = express.Router();

jobRouter.get("/unpaid", getProfile, getUnpaidJobs);
jobRouter.post("/:job_id/pay", getProfile, payForJob);

export default jobRouter;
