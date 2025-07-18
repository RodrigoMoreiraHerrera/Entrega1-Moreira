import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";

import { generateToken } from "../utils/jwt.js";


export async function createUser(req, res)  {

  const { email, password, first_name, last_name, age, role } = req.body;
  if (!email || !password || !first_name || !last_name || !age || !role) {
    return res
      .status(400)
      .json({ message: "Email, contraseña, nombre, apellido, edad y rol son requeridos" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ email, password: hashedPassword, first_name, last_name, age, role });
    await newUser.save();


    res
      .status(201)
      .redirect("/");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }


};

export async function loginUser(req, res) {

  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }
    

        
    // Generate JWT token
const token = generateToken(user);
    res.cookie('currentUser', token, { signed: true, httpOnly: true });
    return res.redirect('/');


  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await userModel.find();
    return res.status(200).json({ users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
}
