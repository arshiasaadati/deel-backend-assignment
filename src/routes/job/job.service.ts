import { Op } from "sequelize";
import { Job, Contract, Profile, sequelize } from "../../model";
const service: any = {};

service.getUnpaid = async (req, res) => {
  try {
    const userId = req.profile.id;
    const unpaidJobs = await Job.findAll({
      include: [
        {
          attributes: [],
          model: Contract,
          required: true,
          where: {
            [Op.or]: [{ ContractorId: userId }, { ClientId: userId }],
            status: {
              [Op.eq]: "in_progress"
            }
          }
        }
      ],
      where: {
        [Op.or]: [{ paid: false }, { paid: null }]
      }
    });
    if (!unpaidJobs || !unpaidJobs?.length) return null;
    return unpaidJobs;
  } catch (err) {
    throw err;
  }
};

service.pay = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    if (req.profile.type !== "client") throw new Error("you can't make any payment!");

    const job: any = await Job.findOne({
      where: { id: req.params.job_id },
      include: [
        {
          model: Contract,
          where: { status: "in_progress", ClientId: req.profile.id }
        }
      ]
    });
    if (!job) throw new Error("the job not found!");
    if (job.paid) throw new Error("you can't pay again!");

    if (req.profile.balance < job.price) throw new Error("your balance is insufficient!");

    const contractor: any = await Profile.findOne({ where: { id: job.Contract.ContractorId } });
    if (!contractor) throw new Error("contractor not found!");

    await Profile.update(
      { balance: req.profile.balance - job.price },
      { where: { id: req.profile.id }, transaction }
    );
    console.log(contractor.id);

    await Profile.update(
      { balance: contractor.balance + job.price },
      { where: { id: contractor.id }, transaction }
    );

    await Job.update(
      { paid: 1, paymentDate: new Date() },
      { where: { id: req.params.job_id }, transaction }
    );

    await transaction.commit();

    return "payment has been successfully";
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

export default service;
