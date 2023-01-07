import { Profile } from "../model";

export const getProfile = async (req, res, next) => {
  try {
    const profile: any = await Profile.findOne({ where: { id: req.get("profile_id") || 0 } });
    if (!profile) return res.status(401).end();
    req.profile = profile;
    next();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
