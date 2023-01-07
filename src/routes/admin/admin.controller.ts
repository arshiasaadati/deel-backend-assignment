import Controller from "../../helpers/controller.helper";
import service from "./admin.service";

const controller = new Controller(service);

export const getBestProfession = async (req, res) => {
  controller.defaultRouterController("bestProfession", req, res);
};

export const getBestClients = async (req, res) => {
  controller.defaultRouterController("bestClients", req, res);
};
