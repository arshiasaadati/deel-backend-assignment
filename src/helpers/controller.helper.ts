import httpError from "http-errors";
export default class Controller {
  constructor(private service) {}

  defaultRouterController = async (methodName, req, res) => {
    try {
      const result = await this.service[methodName](req, res);
      if (!result) {
        res.status(404).json(httpError.NotFound());
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
}
