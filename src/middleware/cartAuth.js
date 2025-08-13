import UserService from "../mongoDAO/services/users.service.js";

const users = new UserService();

export const cartAuth = async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Usuario incorrecto" });
    }
    const user = await users.getById(req.user.id);
   
    const cid = req.params.cid;
    if (!user || user.cart_id.toString() !== cid) {
        return res.status(403).json({ error: 'Forbidden - cartAuth' });
    }
    next();
};

