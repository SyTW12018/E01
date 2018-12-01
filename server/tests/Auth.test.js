/* global it describe run beforeEach before */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import { cleanDatabase, prepareDatabase } from './TestHelper';

chai.use(chaiHttp);

const url = `http://localhost:${app.get('port')}`;
const agent = chai.request.agent(app);

before(prepareDatabase);
beforeEach(cleanDatabase);

describe('Temporal users', () => {
  it('should add a temporal user when don\'t have auth token', (done) => {
    chai.request(url)
      .get('/api/users')
      .end((err, res) => {
        expect(res).to.have.cookie('authToken');
        expect(res.body).to.have.property('users').to.has.length(4);
        expect(res.body.users[0]).to.have.property('registered').to.be.equal(false);
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should not add a temporal user when have auth token', (done) => {
    agent.get('/api/users')
      .end((err, res) => {
        expect(res).to.have.cookie('authToken');
        expect(res.body).to.have.property('users').to.has.length(4);
        expect(res.body.users[0]).to.have.property('registered').to.be.equal(false);
        expect(res).to.have.status(200);

        agent.get('/api/users')
          .end((err, res) => {
            expect(res).not.to.have.cookie('authToken');
            expect(res.body).to.have.property('users').to.has.length(4);
            expect(res.body.users[0]).to.have.property('registered').to.be.equal(false);
            expect(res).to.have.status(200);
            done();
          });
      });
  });
});

describe('Web tokens', () => {
  it('should get auth token on isValid request', (done) => {
    chai.request(url)
      .get('/api/users')
      .end((err, res) => {
        expect(res).to.have.cookie('authToken');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should get auth token on any request', (done) => {
    chai.request(url)
      .get('/ujbujvbuov')
      .end((err, res) => {
        expect(res).to.have.cookie('authToken');
        expect(res).to.have.status(404);
        done();
      });
  });
});

setTimeout(() => run(), 3000);
