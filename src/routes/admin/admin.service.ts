import { Op } from "sequelize";
import { Job, Contract, Profile, sequelize } from "../../model";
const service: any = {};

service.bestProfession = async (req, res) => {
  try {
    if (req.query.start === undefined || req.query.end === undefined)
      throw new Error("start and end is required");

    const bestProfession = await Profile.findAll({
      attributes: ["profession", [sequelize.fn("SUM", sequelize.col("price")), "earned"]],
      include: [
        {
          model: Contract,
          as: "Contractor",
          attributes: [],
          required: true,
          include: [
            {
              model: Job,
              required: true,
              attributes: [],
              where: {
                paid: true,
                paymentDate: {
                  [Op.between]: [req.query.start, req.query.end]
                }
              }
            }
          ]
        }
      ],
      where: {
        type: "contractor"
      },
      group: ["profession"],
      order: [[sequelize.col("earned"), "DESC"]],
      limit: 1,
      subQuery: false
    });
    return bestProfession[0];
  } catch (err) {
    throw err;
  }
};

service.bestClients = async (req, res) => {
  try {
    if (req.query.start === undefined || req.query.end === undefined)
      throw new Error("start and end is required");

    const bestClients: any[] = await Job.findAll({
      attributes: [[sequelize.fn("sum", sequelize.col("price")), "paid"]],
      include: [
        {
          model: Contract,
          attributes: ["id"],
          include: [
            {
              model: Profile,
              as: "Client",
              where: { type: "client" },
              attributes: ["id", "firstName", "lastName"]
            }
          ]
        }
      ],
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [req.query.start, req.query.end]
        }
      },
      order: [[sequelize.col("paid"), "DESC"]],
      group: ["Contract.Client.id"],
      limit: req.query.limit ? req.query.limit : 2
    });

    return bestClients.map((groupedJobs: any) => ({
      paid: groupedJobs.paid,
      id: groupedJobs.Contract.Client.id,
      fullName: `${groupedJobs.Contract.Client.firstName} ${groupedJobs.Contract.Client.lastName}`
    }));
  } catch (err) {
    throw err;
  }
};

export default service;
