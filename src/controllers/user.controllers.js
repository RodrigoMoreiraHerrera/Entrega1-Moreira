
import UserService from "../mongoDAO/services/users.service.js";
import bcrypt from "bcrypt";

import { generateToken } from "../utils/jwt.js";

const users = new UserService();

class UserControllers {

  static async create(req, res) {
    const { email, password, first_name, last_name, age, role } = req.body;
    if (!email || !password || !first_name || !last_name || !age || !role) {
      return res.status(400).json({
        message: "Email, contraseña, nombre, apellido, edad y rol son requeridos",
      });
    }

    try {
      const existingUser = await users.exists(email);
      if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await users.createUser({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        age,
        role,
      });

      res.status(201).redirect("/login");
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error en el servidor", error: error.message });
    }
  }

  static async  login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son requeridos" });
    }

    try {
      const user = await users.exists(email);
      if (!user) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }
      const token = generateToken(user);
      res.cookie("currentUser", token, { signed: true, httpOnly: true });
      return res.redirect("/");
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error en el servidor", error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const users = await users.getAll();
      return res.status(200).json({ users });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error en el servidor", error: error.message });
    }
  }

  static async getCurrent(req, res) {
    const userToken = req.user;
    const user = await users.getById(req.user.id);
    if (!user) {
      return res.status(401).send("No autorizado");
    }
    res.json({ user, userToken });
  }

  static async logout(req, res) {
    res.clearCookie("currentUser").redirect("/");
  }

};

export default UserControllers;