import UserService from "../mongoDAO/services/users.service.js";

const users = new UserService();

export const userAuth = async (req, res, next) => {
  const user = await users.getById(req.user.id);
  console.log("userAuth middleware:", user);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden - userAuth" });
  }
  next();
};
