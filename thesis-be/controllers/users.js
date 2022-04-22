import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import user from '../models/user.js';

export const signIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await user.findOne({ username });

    if (!existingUser)
      return res.status(404).json({ message: 'User does not exist!' });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Password is incorrect!' });

    const token = jwt.sign(
      { username: existingUser.username, id: existingUser._id },
      'tranvanha140799',
      { expiresIn: '1h' }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

export const signUp = async (req, res) => {
  const { firstName, lastName, username, password, confirmPassword } = req.body;

  try {
    const existingUser = await user.findOne({ username });

    if (existingUser) return res.status(400).json({ message: 'User already exist!' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match!" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await user.create({
      username,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign(
      { username: result.username, id: result._id },
      'tranvanha140799',
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
};
