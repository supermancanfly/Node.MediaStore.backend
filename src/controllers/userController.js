import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto'

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {

    const token = generateToken(user._id, user.name, user.email, user.phone, user.permission);

    const userdata = {
      _id: user._id,
      name: user.name,
      email: user.email,
      permission: user.permission,
      phone: user.phone,
      country: user.country,
      timezone: user.timezone,
      bio: user.bio,
      photourl: user.photourl,
      from: user.from
    }

    const data = {
      user: userdata,
      token: token
    }

    res.send(data);

  } else {

    res.status(401);
    throw new Error('Invalid email or password');

  }
});
export const googleLoginUser = asyncHandler(async (req, res) => {

  const { email, name, photoUrl } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const token = generateToken(user._id, user.name, user.email, user.phone, user.permission);
    const userdata = {
      _id: user._id,
      name: user.name,
      email: user.email,
      permission: user.permission,
      phone: user.phone,
      country: user.country,
      timezone: user.timezone,
      bio: user.bio,
      photourl: user.photourl,
      from: user.from
    }
    const data = {
      user: userdata,
      token: token
    }
    return res.send(data);
  } if (!user) {
    const googleUser = await User.create({
      name: name,
      email: email,
      phone: "",
      password: "",
      permission: "customer",
      country: '',
      timezone: '',
      photourl: photoUrl,
      bio: '',
      from: 'google'
    });
    if (googleUser) {
      console.log(googleUser)
      const token = generateToken(googleUser._id, googleUser.name, googleUser.email, googleUser.phone, googleUser.permission);
      const data = {
        user: googleUser,
        token: token
      }
      return res.send(data);
    }
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    permission: "customer",
    country: '',
    timezone: '',
    photourl: '',
    bio: '',
    from: "local"
  });

  if (user) {
    if (user) res.send({ status: "success", message: "New user was created from local" })
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


export const refreshToken = asyncHandler(async (req, res) => {
  console.log("1")
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.json({ status: 'failed', message: "Expired token" });
      }
    } else {
      let email = decoded.email;
      const user = await User.findOne({ email: email });
      if (user) {
        const token = generateToken(user._id, user.name, user.email, user.phone, user.permission);

        const userdata = {
          _id: user._id,
          name: user.name,
          email: user.email,
          permission: user.permission,
          phone: user.phone,
          country: user.country,
          timezone: user.timezone,
          bio: user.bio,
          photourl: user.photourl,
          from: user.from
        }

        const data = {
          user: userdata,
          token: token
        }

        res.send({ data: data, status: 'success', message: "Authorized" });
      } else {
        res.json({ status: 'failed', message: 'Token Invalid. Your account was hacked. Ask for support team.' });
      }
    }
  });
});


export const saveUserProfile = async (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error', err);
      throw err;
    }
    const { _id, name, email, permission, country, timezone, bio } = fields;

    let photoPath = '';
    if (files.photo) {
      try {
        if (!files.photo[0].filepath || !files.photo[0].originalFilename) {
          throw new Error("Invalid file information");
        }

        const originalPath = files.photo[0].filepath;
        const parsedPath = path.parse(files.photo[0].originalFilename);
        // photoPath = '/uploads/' + parsedPath.name + parsedPath.ext;
        const nick = crypto.randomBytes(16).toString('hex') + parsedPath.ext;
        photoPath = '/avatars/' + nick;
        const savePath = '/uploads/avatars/' + nick;

        const data = await fs.readFile(originalPath);
        const __dirname = path.resolve();
        const newPath = path.join(__dirname, savePath);
        await fs.writeFile(newPath, data);
      } catch (err) {
        console.error(err);
        throw err;
      }
    }

    const user = await User.findOne({ _id });

    if (user && name[0] && email[0] && permission[0] && country[0] && timezone[0] && bio[0]) {
      user.name = name[0];
      user.email = email[0];
      user.permission = permission[0];
      user.country = country[0];
      user.timezone = timezone[0];
      user.bio = bio[0];
      user.photourl = photoPath;
      await user.save();
    } else {
      res.send({status: "failed", message: "An error was caused"})
    }

    const token = generateToken(user._id, user.name, user.email, user.phone, user.permission);

    const userdata = {
      _id: user._id,
      name: user.name,
      email: user.email,
      permission: user.permission,
      phone: user.phone,
      country: user.country,
      timezone: user.timezone,
      bio: user.bio,
      photourl: user.photourl
    }

    const data = {
      user: userdata,
      token: token
    }

    res.send({ data: data, status: "success", message: "Updated successfully" });
  });
};

export const resetPassword = asyncHandler(async (req, res) => {

  const { email, password, confirmPassword } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) return res.send({ status: "failed", message: "Email don't exist" });

  if (password === confirmPassword) {
    user.password = password;
    // await User.findOneAndUpdate({email}, {password: password});
    await user.save();
    return res.send({ status: "success", message: "Password reset successfully." })
  }

});