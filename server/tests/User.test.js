/* global it describe run beforeEach */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import { cleanDatabase } from './TestHelper';

chai.use(chaiHttp);

const url = `http://localhost:${app.get('port')}`;

beforeEach(cleanDatabase);

describe('All users', () => {
  it('should get all users', (done) => {
    chai.request(url)
      .get('/api/users')
      .end((err, res) => {
        expect(res.body).to.have.property('users').to.has.length(4);
        expect(res.body.users[0]).to.have.property('registered').to.be.equal(false);
        expect(res.body.users[1]).to.have.property('registered').to.be.equal(true);
        expect(res.body.users[2]).to.have.property('registered').to.be.equal(true);
        expect(res.body.users[3]).to.have.property('registered').to.be.equal(true);
        expect(res).to.have.status(200);
        done();
      });
  });
});


setTimeout(() => run(), 3000);
