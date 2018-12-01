/* global it describe run beforeEach before */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import { cleanDatabase, prepareDatabase, loginAsAdmin } from './TestHelper';

chai.use(chaiHttp);

const url = `http://localhost:${app.get('port')}`;
const agent = chai.request.agent(app);

before(prepareDatabase);
beforeEach(cleanDatabase);

describe('Temporal users', () => {
  it('should add a temporal user when don\'t have auth token', async (done) => {
    await chai.request(url).get('/users');
    await loginAsAdmin(agent);

    const res = await agent.get('/users');
    expect(res).not.to.have.cookie('authToken');
    expect(res.body).to.have.property('users').to.has.length(4);
    expect(res.body.users[0]).to.have.property('role').to.be.equal('temporalUser');
    expect(res).to.have.status(200);
    done();
  });

  it('should not add a temporal user when have auth token', async (done) => {
    await loginAsAdmin(agent);

    const res = await agent.get('/users');
    expect(res).not.to.have.cookie('authToken');
    expect(res.body).to.have.property('users').to.has.length(3);
    expect(res.body.users[0]).to.have.property('role').to.be.equal('registeredUser');
    expect(res).to.have.status(200);
    done();
  });
});

describe('Web tokens', () => {
  it('should get auth token on valid request', async (done) => {
    const res = await chai.request(url).get('/users');
    expect(res).to.have.cookie('authToken');
    expect(res).to.have.status(401);
    done();
  });

  it('should get auth token on any request', async (done) => {
    const res = await chai.request(url).get('/fasdasfg');
    expect(res).to.have.cookie('authToken');
    expect(res).to.have.status(404);
    done();
  });

  it('should not get auth token when have authToken', async (done) => {
    await loginAsAdmin(agent);
    const res = await chai.request(url).get('/users');
    expect(res).to.not.have.cookie('authToken');
    expect(res).to.have.status(200);
    done();
  });
});

setTimeout(() => run(), 3000);
