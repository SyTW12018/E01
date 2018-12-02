import jwt from 'jsonwebtoken';
import ms from 'ms';
import NodeRSA from 'node-rsa';
import UserService from '../services/UserService';
import loginValidator from '../validators/LoginValidator';
import registerUserValidator from '../validators/RegisterUserValidator';
import User from '../models/User';

const cert = new NodeRSA({ b: 2048 });
// cert = fs.readFileSync('keys/private.key');

async function generateToken(cuid) {
  // Generate token with cuid as payload
  return jwt.sign({ cuid }, cert.exportKey('private'), {
    algorithm: 'RS256',
    expiresIn: ms('6m'),
  });
}

async function getUser(token) {
  // Verify authToken and get user from cuid (the cuid is in the payload of the token)
  try {
    const decoded = await jwt.verify(token, cert.exportKey('public'), { algorithms: [ 'RS256' ] });
    return UserService.getUser(decoded.cuid);
  } catch (err) {
    return null;
  }
}

async function createTempUser(req, res) {
  req.user = await UserService.addTemporalUser();
  await sendToken(req.user, res);
}

async function sendToken(user, res) {
  const token = await generateToken(user.cuid);
  res.cookie('authToken', token, { maxAge: ms('6m') });
}

const login = () => (req, res) => {
  loginValidator(req, res, async () => {
    const user = await UserService.getUserByEmailAndPassword(req.body.user.email, req.body.user.password);
    if (!user) {
      return res.status(401).json({ errors: [ 'Invalid credentials' ] });
    }

    await UserService.deleteTemporalUser(req.user.cuid);
    await sendToken(user, res);
    return res.status(200).json({ cuid: user.cuid });
  });
};

const register = () => async (req, res) => {
  registerUserValidator(req, res, async () => {
    const user = await UserService.getUserByEmail(req.body.user.email);
    if (user) {
      return res.status(400).json({ errors: [ 'The email is already in use' ] });
    }

    const newUser = await UserService.registerUser(req.body.user);
    await UserService.deleteTemporalUser(req.user.cuid);
    return res.status(201).json({ cuid: newUser.cuid });
  });
};

const middleware = () => async (req, res, next) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    await createTempUser(req, res);
  } else {
    const user = await getUser(authToken);
    if (user) {
      req.user = user;
    } else {
      await createTempUser(req, res);
    }
  }

  next();
};

export default middleware;

export {
  login,
  register,
};
