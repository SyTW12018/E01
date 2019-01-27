import ms from 'ms';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

const sendToken = async (user, res) => {
  const token = await AuthService.generateToken(user.cuid);
  res.cookie('authToken', token, { maxAge: ms('0.5y') });
};

const createTempUser = async (req, res) => {
  req.user = await UserService.addTemporalUser();
  await sendToken(req.user, res);
};

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

const update = () => async (req, res) => {
  if (!req.user || req.user.role === 'temporalUser') {
    return res.status(400).json({ errors: [ 'You must be registered to update your profile' ] });
  }

  const updatedUser = req.body.user;
  updatedUser.cuid = req.user.cuid;
  let user = await UserService.getUserByEmailAndPassword(req.user.email, updatedUser.currentPassword);
  if (!user) {
    return res.status(400).json({ errors: [ 'Invalid current password' ] });
  }

  user = await UserService.getUserByEmail(updatedUser.email);
  if (user && user.cuid !== updatedUser.cuid) {
    return res.status(400).json({ errors: [ 'The email is already in use' ] });
  }

  if (updatedUser.newPassword && updatedUser.newPassword !== '') {
    updatedUser.password = updatedUser.newPassword;
  }
  const result = await UserService.updateUser(updatedUser);
  return res.status(result ? 200 : 400).json({ cuid: updatedUser.cuid });
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
  update,
  getCurrentUser,
};
