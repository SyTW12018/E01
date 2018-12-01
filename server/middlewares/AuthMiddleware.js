import UserService from '../services/UserService';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const cert = fs.readFileSync('private.key');

async function generateToken(cuid) {
  // TODO generate token with cuid as payload
  const token = await jwt.sign({
      cuid
    },
    cert,
    {
      algorithm: 'RS256', expiresIn: 60*60*24 
    });
  return token;
}

async function validateToken(token) {
  // TODO verify authToken and get user from cuid (the cuid is in the payload of the token)
  try {
    const decoded = await jwt.verify(token,cert);
    return UserService.getUser(decoded.cuid);
  } catch(err) {
    return null;
  }
}

async function createTempUser(req, res) {
  req.user = await UserService.addTemporalUser();
  const token = await generateToken(req.user.cuid);
  res.cookie('authToken', token, { maxAge: 18000000 });
}

async function middleware(req, res, next) {
  const { authToken } = req.cookies;

  if (!authToken) {
    await createTempUser(req, res);
  } else {
    const user = await validateToken(authToken);
    if (user) {
      req.user = user;
    } else {
      await createTempUser(req, res);
    }
  }

  next();
}

export default () => middleware;