
import { userModel } from '../models/user.model.js';



class UserService {

    async exists(email) {
         const existingUser = await userModel.findOne({ email });
            if (existingUser) {
              return existingUser;
            }
            return false;
    }

    async createUser(userData) {
        const newUser = new userModel(userData);
        await newUser.save();
        return newUser;
    }

    async getAll() {
        return await userModel.find();
    }

    async getById(id) {
        return await userModel.findById(id).lean();
    }

}

export default UserService;

