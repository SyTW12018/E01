import UserService from '../services/UserService';

async function generateToken(cuid) {
  // TODO generate token with cuid as payload
  return `token${cuid}`;
}

async function validateToken(token) {
  // TODO verify authToken and get user from cuid (the cuid is in the payload of the token)
  const cuid = token.replace('token', '');
  return UserService.getUser(cuid);
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
