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

describe('Temporal usersRoutes', () => {
  it('should add a temporal user when don\'t have auth token', async () => {
    await chai.request(url).get('/usersRoutes');
    await loginAsAdmin(agent);

    const res = await agent.get('/usersRoutes');
    expect(res).not.to.have.cookie('authToken');
    expect(res.body).to.have.property('users').to.has.length(4);
    const users = res.body.users.filter(user => user.role === 'temporalUser');
    expect(users).to.has.length(1);
    expect(res).to.have.status(200);
  });

  it('should not add a temporal user when have auth token', async () => {
    await loginAsAdmin(agent);

    const res = await agent.get('/usersRoutes');
    expect(res).not.to.have.cookie('authToken');
    expect(res.body).to.have.property('users').to.has.length(3);
    const users = res.body.users.filter(user => user.role === 'temporalUser');
    expect(users).to.has.length(0);
    expect(res).to.have.status(200);
  });
});

describe('Web tokens', () => {
  it('should get auth token on valid request', async () => {
    const res = await chai.request(url).get('/usersRoutes');
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
    const res = await agent.get('/usersRoutes');
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

    res = await agent.get('/usersRoutes');
    expect(res.body).to.have.property('users').to.has.length(4);

    res.body.users.forEach((user) => {
      expect(user).to.have.property('name');
      expect(user).to.have.property('email');
      expect(user).to.have.property('role');

      switch (user.name) {
        case 'Maria':
          expect(user.role).to.be.equal('registeredUser');
          break;
        case 'Juan':
          expect(user.role).to.be.equal('registeredUser');
          break;
        case 'May':
          expect(user.role).to.be.equal('admin');
          break;
        case 'Alberto':
          expect(user.role).to.be.equal('registeredUser');
          break;
        default:
          break;
      }
    });

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
