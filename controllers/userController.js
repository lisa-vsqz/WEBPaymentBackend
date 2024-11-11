const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, phoneNumber, role });
    const { password: _, ...userData } = user.toJSON();
    res.status(201).json(userData);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Email already exists.' });
    } else if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll(); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber; // Allowing for null
    if (password) {
      // Hashear la nueva contraseña
      user.password = await bcrypt.hash(password, 10);
    }
    if (role) user.role = role;

    await user.save();
    const { password: _, ...userData } = user.toJSON();
    res.json(userData);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Email already exists.' });
    } else if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};