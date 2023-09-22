import jwt from 'jsonwebtoken';

const generateToken = ( _id, name, email, phone, permission) => {
  const token = jwt.sign({ _id, name, email, phone, permission}, process.env.JWT_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256'
  });
  return token;
};

export default generateToken;
