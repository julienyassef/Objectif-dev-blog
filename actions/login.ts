"use server";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../utils/dbConnect';
import User from '../models/user';

export type LoginValues = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message?: string;
  token?: string;
};

const getUserByEmail = async (email: string) => {
  await dbConnect(); // Connexion à la base de données
  console.log('Connecting to MongoDB...');
  return User.findOne({ email });
};

export const login = async (values: LoginValues): Promise<LoginResponse> => {
  const { email, password } = values;
  console.log('Login attempt:', email);
  // console.log('Login attempt:', password);

  const user = await getUserByEmail(email);
  if (!user) {
    console.log('User not found');
    return {
      success: false,
      message: "wrong credentials"
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', passwordMatch);

  if (!passwordMatch) {
    console.log('Password incorrect');
    return {
      success: false,
      message: "wrong credentials"
    };
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
  }

  const token = jwt.sign(
    { email: user.email },
    jwtSecret as string,
    { expiresIn: '1h' }
  );

  console.log('Login successful:', email);

  return {
    success: true,
    token: token
  };
};
