import jwt from 'jsonwebtoken';
import ms from 'ms';
import NodeRSA from 'node-rsa';
import UserService from './UserService';

const cert = new NodeRSA({ b: 2048 });
// cert = fs.readFileSync('keys/private.key');

async function generateToken(cuid) {
  // Generate token with cuid as payload
  return jwt.sign({ cuid }, cert.exportKey('private'), {
    algorithm: 'RS256',
    expiresIn: ms('0.5y'),
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

export default {
  generateToken,
  getUser,
};
