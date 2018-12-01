/* global it describe run beforeEach before */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import { cleanDatabase, prepareDatabase } from './TestHelper';

chai.use(chaiHttp);

const url = `http://localhost:${app.get('port')}`;

before(prepareDatabase);
beforeEach(cleanDatabase);

describe('Users', () => {
  it('should get all users', (done) => {
    chai.request(url)
      .get('/users')
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

  it('should get one user', (done) => {
    chai.request(url)
      .get('/users/cjoofresr00001ktst8obwhbs')
      .end((err, res) => {
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('cuid').to.be.equal('cjoofresr00001ktst8obwhbs');
        expect(res.body.user).to.have.property('name').to.be.equal('May');
        expect(res.body.user).to.have.property('email').to.be.equal('may@may.com');
        expect(res.body.user).to.have.property('slug').to.be.equal('may');
        expect(res.body.user).to.have.property('registered').to.be.equal(true);
        expect(res.body.user).to.not.have.property('password');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should create a user', (done) => {
    chai.request(url)
      .post('/users')
      .send({
        user: {
          name: 'Monica',
          email: 'monica@monica.com',
          password: 'monica',
        },
      })
      .end((err, res) => {
        expect(res.body).to.have.property('cuid').to.has.length(25);
        expect(res).to.have.status(201);
        done();
      });
  });

  it('should update a user', (done) => {
    chai.request(url)
      .put('/users/cjoofresr00001ktst8obwhbs')
      .send({
        user: {
          name: 'Monica',
          email: 'monica@monica.com',
          password: 'monica',
        },
      })
      .end((err, res) => {
        expect(res.body).to.have.property('cuid').to.be.equal('cjoofresr00001ktst8obwhbs');
        expect(res).to.have.status(200);

        chai.request(url)
          .get('/users/cjoofresr00001ktst8obwhbs')
          .end((err, res) => {
            expect(res.body).to.have.property('user');
            expect(res.body.user).to.have.property('cuid').to.be.equal('cjoofresr00001ktst8obwhbs');
            expect(res.body.user).to.have.property('name').to.be.equal('Monica');
            expect(res.body.user).to.have.property('email').to.be.equal('monica@monica.com');
            expect(res.body.user).to.have.property('slug').to.be.equal('monica');
            expect(res.body.user).to.have.property('registered').to.be.equal(true);
            expect(res.body.user).to.not.have.property('password');
            expect(res).to.have.status(200);
            done();
          });
      });
  });

  it('should delete a user', (done) => {
    chai.request(url)
      .delete('/users/cjoofresr00001ktst8obwhbs')
      .end((err, res) => {
        expect(res.body).to.have.property('cuid').to.be.equal('cjoofresr00001ktst8obwhbs');
        expect(res).to.have.status(200);

        chai.request(url)
          .get('/users/cjoofresr00001ktst8obwhbs')
          .end((err, res) => {
            expect(res).to.have.status(404);
            done();
          });
      });
  });

  it('should not get a user when the request is invalid', (done) => {
    chai.request(url)
      .get('/users/cjoofresr00001ktst8obws')
      .end((err, res) => {
        expect(res.body).to.have.property('errors').to.has.length(1);
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should not create a user when the request is invalid', (done) => {
    chai.request(url)
      .post('/users')
      .send({
        user: {
          name: 'm',
          email: 'monicamonica.com',
          password: 'moa',
        },
      })
      .end((err, res) => {
        expect(res.body).to.have.property('errors').to.has.length(3);
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should not update a user when the request is invalid', (done) => {
    chai.request(url)
      .put('/users/cjoofresr00001ktst8obwhbs')
      .send({
        user: {
          name: 'm',
          email: 'monicamonica.com',
          password: 'moa',
        },
      })
      .end((err, res) => {
        expect(res.body).to.have.property('errors').to.has.length(3);
        expect(res).to.have.status(400);

        chai.request(url)
          .get('/users/cjoofresr00001ktst8obwhbs')
          .end((err, res) => {
            expect(res.body).to.have.property('user');
            expect(res.body.user).to.have.property('cuid').to.be.equal('cjoofresr00001ktst8obwhbs');
            expect(res.body.user).to.have.property('name').to.be.equal('May');
            expect(res.body.user).to.have.property('email').to.be.equal('may@may.com');
            expect(res.body.user).to.have.property('slug').to.be.equal('may');
            expect(res.body.user).to.have.property('registered').to.be.equal(true);
            expect(res.body.user).to.not.have.property('password');
            expect(res).to.have.status(200);
            done();
          });
      });
  });

  it('should get 404 when user does not exist', (done) => {
    chai.request(url)
      .get('/users/cjoofresr00001ktst8obphbl')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});

setTimeout(() => run(), 3000);
