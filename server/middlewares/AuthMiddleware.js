import jwt from 'jsonwebtoken';
import ms from 'ms';
import NodeRSA from 'node-rsa';
import UserService from '../services/UserService';

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
  const token = await generateToken(req.user.cuid);
  res.cookie('authToken', token, { maxAge: ms('6m') });
}

async function middleware(req, res, next) {
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
}

export default () => middleware;
