import Controller from "../../helpers/controller.helper";
import service from "./job.service";

const controller = new Controller(service);

export const getUnpaidJobs = async (req, res) => {
  controller.defaultRouterController("getUnpaid", req, res);
};

export const payForJob = async (req, res) => {
  controller.defaultRouterController("pay", req, res);
};
