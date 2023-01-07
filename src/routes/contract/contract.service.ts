import { Op } from "sequelize";
import { Contract } from "../../model";
const service: any = {};

service.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findOne({
      where: {
        id,
        [Op.or]: [{ ContractorId: req.profile.id }, { ClientId: req.profile.id }]
      }
    });
    if (!contract) return null;
    return contract;
  } catch (err) {
    throw err;
  }
};

service.allNonTerminate = async (req, res) => {
  try {
    const contract = await Contract.findAll({
      where: {
        [Op.or]: [{ ContractorId: req.profile.id }, { ClientId: req.profile.id }],
        status: {
          [Op.ne]: "terminated"
        }
      }
    });
    if (!contract) return null;
    return contract;
  } catch (err) {
    throw err;
  }
};

export default service;
