import ms from 'ms';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

async function createTempUser(req, res) {
  req.user = await UserService.addTemporalUser();
  await sendToken(req.user, res);
}

async function sendToken(user, res) {
  const token = await AuthService.generateToken(user.cuid);
  res.cookie('authToken', token, { maxAge: ms('0.5y') });
}

const login = () => async (req, res) => {
  const user = await UserService.getUserByEmailAndPassword(req.body.user.email, req.body.user.password);
  if (!user) {
    return res.status(401).json({ errors: [ 'Invalid credentials' ] });
  }

  await UserService.deleteTemporalUser(req.user.cuid);
  await sendToken(user, res);
  return res.status(200).json({ cuid: user.cuid });
};

const register = () => async (req, res) => {
  const user = await UserService.getUserByEmail(req.body.user.email);
  if (user) {
    return res.status(400).json({ errors: [ 'The email is already in use' ] });
  }

  const newUser = await UserService.registerUser(req.body.user);
  await UserService.deleteTemporalUser(req.user.cuid);
  return res.status(201).json({ cuid: newUser.cuid });
};

const getCurrentUser = () => async (req, res) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    return res.status(401).json({ errors: [ 'No authentication token received' ] });
  }

  const user = await AuthService.getUser(authToken);
  return res.status(200).json({ ...user });
};

const middleware = () => async (req, res, next) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    await createTempUser(req, res);
  } else {
    const user = await AuthService.getUser(authToken);
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
  getCurrentUser,
};
