import { Op } from "sequelize";
import { Job, Contract, Profile, sequelize } from "../../model";
const service: any = {};

service.deposit = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    if (req.body.deposit === undefined) throw new Error("deposit is required");

    const client: any = await Profile.findOne({
      where: {
        id: req.params.userId
      }
    });

    if (client.type !== "client") throw new Error("you can't deposit!");

    const totalJobsToPay: any[] = await Job.findAll({
      attributes: {
        include: [[sequelize.fn("SUM", sequelize.col("price")), "totalPrice"]]
      },
      include: [
        {
          attributes: [],
          model: Contract,
          required: true,
          where: {
            ClientId: client.id,
            status: "in_progress"
          }
        }
      ],
      where: {
        [Op.or]: [{ paid: false }, { paid: null }]
      },
      transaction
    });

    if (totalJobsToPay[0].dataValues.totalPrice == null)
      throw new Error("you don't have any unpaid job!");

    if (req.body.deposit > totalJobsToPay[0].dataValues.totalPrice * 0.25)
      throw new Error(
        `you can't deposit more than ${totalJobsToPay[0].dataValues.totalPrice * 0.25}`
      );

    await client.increment({ balance: req.body.deposit }, { transaction });

    await transaction.commit();

    return `you have ${client.balance + req.body.deposit} deposit`;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

export default service;
