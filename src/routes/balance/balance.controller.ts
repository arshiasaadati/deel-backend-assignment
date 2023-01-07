import Controller from "../../helpers/controller.helper";
import service from "./balance.service";

const controller = new Controller(service);

export const deposit = async (req, res) => {
  controller.defaultRouterController("deposit", req, res);
};
