/* global it describe run beforeEach before */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { cleanDatabase, prepareDatabase, loginAsAdmin } from './TestHelper';

chai.use(chaiHttp);

const agent = chai.request.agent(server);

before(prepareDatabase);
beforeEach(cleanDatabase);

describe('Users', () => {
  it('should get all users', async () => {
    await loginAsAdmin(agent);

    const res = await agent.get('/users');
    expect(res.body).to.have.property('users').to.has.length(3);
    const registeredUsers = res.body.users.filter(user => user.role === 'registeredUser');
    expect(registeredUsers).to.has.length(2);
    const adminUsers = res.body.users.filter(user => user.role === 'admin');
    expect(adminUsers).to.has.length(1);
    expect(res).to.have.status(200);
  });

  it('should get one user', async () => {
    await loginAsAdmin(agent);

    const res = await agent.get('/users/cjoofresr00001ktst8obwhbs');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.have.property('cuid').to.be.equal('cjoofresr00001ktst8obwhbs');
    expect(res.body.user).to.have.property('name').to.be.equal('May');
    expect(res.body.user).to.have.property('email').to.be.equal('may@may.com');
    expect(res.body.user).to.have.property('slug').to.be.equal('may');
    expect(res.body.user).to.have.property('role').to.be.equal('admin');
    expect(res.body.user).to.not.have.property('password');
    expect(res).to.have.status(200);
  });

  it('should create a user', async () => {
    await loginAsAdmin(agent);

    const res = await agent.post('/users').send({
      user: {
        name: 'Monica',
        email: 'monica@monica.com',
        password: 'monica',
      },
    });
    expect(res.body).to.have.property('cuid').to.has.length(25);
    expect(res).to.have.status(201);
  });

  it('should update a user', async () => {
    await loginAsAdmin(agent);

    let res = await agent.put('/users/cjoogdu2x0000gctsqv3m95nd').send({
      user: {
        name: 'Monica',
        email: 'monica@monica.com',
        password: 'monica',
      },
    });
    expect(res.body).to.have.property('cuid').to.be.equal('cjoogdu2x0000gctsqv3m95nd');
    expect(res).to.have.status(200);

    res = await agent.get('/users/cjoogdu2x0000gctsqv3m95nd');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.have.property('cuid').to.be.equal('cjoogdu2x0000gctsqv3m95nd');
    expect(res.body.user).to.have.property('name').to.be.equal('Monica');
    expect(res.body.user).to.have.property('email').to.be.equal('monica@monica.com');
    expect(res.body.user).to.have.property('slug').to.be.equal('monica');
    expect(res.body.user).to.have.property('role').to.be.equal('registeredUser');
    expect(res.body.user).to.not.have.property('password');
    expect(res).to.have.status(200);
  });

  it('should delete a user', async () => {
    await loginAsAdmin(agent);

    let res = await agent.delete('/users/cjoogdu2x0000gctsqv3m95nd');
    expect(res.body).to.have.property('cuid').to.be.equal('cjoogdu2x0000gctsqv3m95nd');
    expect(res).to.have.status(200);

    res = await agent.get('/users/cjoogdu2x0000gctsqv3m95nd');
    expect(res).to.have.status(404);
  });

  it('should not get a user when the request is invalid', async () => {
    await loginAsAdmin(agent);

    const res = await agent.get('/users/cjoofresr00001ktst8obws');
    expect(res.body).to.have.property('errors').to.has.length(1);
    expect(res).to.have.status(400);
  });

  it('should not create a user when the request is invalid', async () => {
    await loginAsAdmin(agent);

    const res = await agent.post('/users').send({
      user: {
        name: 'm',
        email: 'monicamonica.com',
        password: 'moa',
      },
    });
    expect(res.body).to.have.property('errors').to.has.length(3);
    expect(res).to.have.status(400);
  });

  it('should not update a user when the request is invalid', async () => {
    await loginAsAdmin(agent);

    let res = await agent.put('/users/cjoofresr00001ktst8obwhbs').send({
      user: {
        name: 'm',
        email: 'monicamonica.com',
        password: 'moa',
      },
    });
    expect(res.body).to.have.property('errors').to.has.length(3);
    expect(res).to.have.status(400);

    res = await agent.get('/users/cjoofresr00001ktst8obwhbs');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.have.property('cuid').to.be.equal('cjoofresr00001ktst8obwhbs');
    expect(res.body.user).to.have.property('name').to.be.equal('May');
    expect(res.body.user).to.have.property('email').to.be.equal('may@may.com');
    expect(res.body.user).to.have.property('slug').to.be.equal('may');
    expect(res.body.user).to.have.property('role').to.be.equal('admin');
    expect(res.body.user).to.not.have.property('password');
    expect(res).to.have.status(200);
  });

  it('should get 404 when user does not exist', async () => {
    await loginAsAdmin(agent);

    const res = await agent.get('/users/cjoofresr00001ktst8obphbl');
    expect(res).to.have.status(404);
  });
});

setTimeout(() => run(), 3000);
