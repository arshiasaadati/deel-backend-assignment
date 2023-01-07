import express from "express";
import { getProfile } from "../../middleware/getProfile";
import { getContractById, getAllContracts } from "./contract.controller";

const contractRouter = express.Router();

/**
 * FIXED!
 * @returns contract by id
 */
contractRouter.get("/:id", getProfile, getContractById);
contractRouter.get("/", getProfile, getAllContracts);

export default contractRouter;
