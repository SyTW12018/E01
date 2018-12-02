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
  it('should add a temporal user when don\'t have auth token', async () => {
    await chai.request(url).get('/users');
    await loginAsAdmin(agent);

    const res = await agent.get('/users');
    expect(res).not.to.have.cookie('authToken');
    expect(res.body).to.have.property('users').to.has.length(4);
    expect(res.body.users[0]).to.have.property('role').to.be.equal('temporalUser');
    expect(res).to.have.status(200);
  });

  it('should not add a temporal user when have auth token', async () => {
    await loginAsAdmin(agent);

    const res = await agent.get('/users');
    expect(res).not.to.have.cookie('authToken');
    expect(res.body).to.have.property('users').to.has.length(3);
    expect(res.body.users[0]).to.have.property('role').to.be.equal('registeredUser');
    expect(res).to.have.status(200);
  });
});

describe('Web tokens', () => {
  it('should get auth token on valid request', async () => {
    const res = await chai.request(url).get('/users');
    expect(res).to.have.cookie('authToken');
    expect(res).to.have.status(401);
  });

  it('should get auth token on any request', async () => {
    const res = await chai.request(url).get('/fasdasfg');
    expect(res).to.have.cookie('authToken');
    expect(res).to.have.status(404);
  });

  it('should not get auth token when have authToken', async () => {
    await loginAsAdmin(agent);
    const res = await agent.get('/users');
    expect(res).to.not.have.cookie('authToken');
    expect(res).to.have.status(200);
  });
});

describe('Login', () => {
  it('should login on valid request', async () => {
    const res = await chai.request(url).post('/login').send({
      user: {
        email: 'alberto@alberto.com',
        password: 'albertoalberto',
      },
    });
    expect(res).to.have.cookie('authToken');
    expect(res).to.have.status(200);
  });

  it('should not login on invalid request', async () => {
    const res = await chai.request(url).post('/login').send({
      user: {
        email: 'alberto@alberto.com',
        password: 'albertoalbert',
      },
    });
    expect(res).to.have.status(401);
  });
});

describe('Register', () => {
  it('should register on valid request', async () => {
    let res = await chai.request(url).post('/signup').send({
      user: {
        name: 'Maria',
        email: 'maria@maria.com',
        password: 'mariamaria',
      },
    });
    expect(res).to.have.cookie('authToken');
    expect(res).to.have.status(201);

    await loginAsAdmin(agent);

    res = await agent.get('/users');
    expect(res.body).to.have.property('users').to.has.length(4);
    expect(res.body.users[0]).to.have.property('name').to.be.equal('Maria');
    expect(res.body.users[0]).to.have.property('email').to.be.equal('maria@maria.com');
    expect(res.body.users[0]).to.have.property('role').to.be.equal('registeredUser');
    expect(res.body.users[1]).to.have.property('role').to.be.equal('registeredUser');
    expect(res.body.users[2]).to.have.property('role').to.be.equal('admin');
    expect(res.body.users[3]).to.have.property('role').to.be.equal('registeredUser');
    expect(res).to.have.status(200);
  });

  it('should not register on invalid request', async () => {
    const res = await chai.request(url).post('/signup').send({
      user: {
        name: 'Maria',
        email: 'mariamaria.com',
        password: 'mariamaria',
      },
    });
    expect(res).to.have.status(400);
  });

  it('should not register on invalid request (same email)', async () => {
    const res = await chai.request(url).post('/signup').send({
      user: {
        name: 'Maria',
        email: 'may@may.com',
        password: 'mariamaria',
      },
    });
    expect(res).to.have.status(400);
  });
});

setTimeout(() => run(), 3000);
