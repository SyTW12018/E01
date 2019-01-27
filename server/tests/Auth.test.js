/* global it describe run beforeEach before */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import {
  cleanDatabase, prepareDatabase, loginAsAdmin, loginAsNotAdmin,
} from './TestHelper';

chai.use(chaiHttp);

const url = `http://localhost:${server.get('port')}`;
const agent = chai.request.agent(server);

before(prepareDatabase);
beforeEach(cleanDatabase);

describe('Temporal users', () => {
  it('should add a temporal user when don\'t have auth token', async () => {
    await chai.request(url).get('/users');
    await loginAsAdmin(agent);

    const res = await agent.get('/users');
    expect(res).not.to.have.cookie('authToken');
    expect(res.body).to.have.property('users').to.has.length(4);
    const users = res.body.users.filter(user => user.role === 'temporalUser');
    expect(users).to.has.length(1);
    expect(res).to.have.status(200);
  });

  it('should not add a temporal user when have auth token', async () => {
    await loginAsAdmin(agent);

    const res = await agent.get('/users');
    expect(res).not.to.have.cookie('authToken');
    expect(res.body).to.have.property('users').to.has.length(3);
    const users = res.body.users.filter(user => user.role === 'temporalUser');
    expect(users).to.has.length(0);
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
    const res = await chai.request(url).post('/auth/login').send({
      user: {
        email: 'alberto@alberto.com',
        password: 'albertoalberto',
      },
    });
    expect(res).to.have.cookie('authToken');
    expect(res).to.have.status(200);
  });

  it('should not login on invalid request', async () => {
    const res = await chai.request(url).post('/auth/login').send({
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
    let res = await chai.request(url).post('/auth/register').send({
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
    const res = await chai.request(url).post('/auth/register').send({
      user: {
        name: 'Maria',
        email: 'mariamaria.com',
        password: 'mariamaria',
      },
    });
    expect(res).to.have.status(400);
  });

  it('should not register on invalid request (same email)', async () => {
    const res = await chai.request(url).post('/auth/register').send({
      user: {
        name: 'Maria',
        email: 'may@may.com',
        password: 'mariamaria',
      },
    });
    expect(res).to.have.status(400);
  });
});

describe('Update', () => {
  it('should update on valid request', async () => {
    await loginAsNotAdmin(agent);

    let res = await agent.post('/auth/update').send({
      user: {
        name: 'Juan2',
        email: 'juan2@juan2.com',
        currentPassword: 'juanjuan',
        newPassword: 'juan2juan2',
      },
    });
    expect(res).to.have.status(200);

    await loginAsAdmin(agent);

    res = await agent.get('/users/cjoogdu2x0000gctsqv3m95nd');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.have.property('cuid').to.be.equal('cjoogdu2x0000gctsqv3m95nd');
    expect(res.body.user).to.have.property('name').to.be.equal('Juan2');
    expect(res.body.user).to.have.property('email').to.be.equal('juan2@juan2.com');
    expect(res.body.user).to.have.property('slug').to.be.equal('juan2');
    expect(res.body.user).to.have.property('role').to.be.equal('registeredUser');
    expect(res.body.user).to.not.have.property('password');
    expect(res).to.have.status(200);

    res = await chai.request(url).post('/auth/login').send({
      user: {
        email: 'juan2@juan2.com',
        password: 'juan2juan2',
      },
    });
    expect(res).to.have.cookie('authToken');
    expect(res).to.have.status(200);
  });

  it('should not update on invalid request (invalid email)', async () => {
    await loginAsNotAdmin(agent);

    let res = await agent.post('/auth/update').send({
      user: {
        name: 'Juan2',
        email: 'juan2juan2.com',
        currentPassword: 'juanjuan',
      },
    });
    expect(res).to.have.status(400);

    await loginAsAdmin(agent);

    res = await agent.get('/users/cjoogdu2x0000gctsqv3m95nd');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.have.property('cuid').to.be.equal('cjoogdu2x0000gctsqv3m95nd');
    expect(res.body.user).to.have.property('name').to.be.equal('Juan');
    expect(res.body.user).to.have.property('email').to.be.equal('juan@juan.com');
    expect(res.body.user).to.have.property('slug').to.be.equal('juan');
    expect(res.body.user).to.have.property('role').to.be.equal('registeredUser');
    expect(res.body.user).to.not.have.property('password');
    expect(res).to.have.status(200);
  });

  it('should not update on invalid request (duplicated email)', async () => {
    await loginAsNotAdmin(agent);

    let res = await agent.post('/auth/update').send({
      user: {
        name: 'Juan2',
        email: 'may@may.com',
        currentPassword: 'juanjuan',
      },
    });
    expect(res).to.have.status(400);

    await loginAsAdmin(agent);

    res = await agent.get('/users/cjoogdu2x0000gctsqv3m95nd');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.have.property('cuid').to.be.equal('cjoogdu2x0000gctsqv3m95nd');
    expect(res.body.user).to.have.property('name').to.be.equal('Juan');
    expect(res.body.user).to.have.property('email').to.be.equal('juan@juan.com');
    expect(res.body.user).to.have.property('slug').to.be.equal('juan');
    expect(res.body.user).to.have.property('role').to.be.equal('registeredUser');
    expect(res.body.user).to.not.have.property('password');
    expect(res).to.have.status(200);
  });

  it('should not update on invalid request (invalid current password)', async () => {
    await loginAsNotAdmin(agent);

    let res = await agent.post('/auth/update').send({
      user: {
        name: 'Juan2',
        email: 'juan2@juan2.com',
        currentPassword: 'tresetf',
      },
    });
    expect(res).to.have.status(400);

    await loginAsAdmin(agent);

    res = await agent.get('/users/cjoogdu2x0000gctsqv3m95nd');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.have.property('cuid').to.be.equal('cjoogdu2x0000gctsqv3m95nd');
    expect(res.body.user).to.have.property('name').to.be.equal('Juan');
    expect(res.body.user).to.have.property('email').to.be.equal('juan@juan.com');
    expect(res.body.user).to.have.property('slug').to.be.equal('juan');
    expect(res.body.user).to.have.property('role').to.be.equal('registeredUser');
    expect(res.body.user).to.not.have.property('password');
    expect(res).to.have.status(200);
  });
});

setTimeout(() => run(), 3000);
