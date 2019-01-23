/* global it describe run beforeEach before */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { cleanDatabase, prepareDatabase, loginAsAdmin } from './TestHelper';

chai.use(chaiHttp);

const url = `http://localhost:${server.get('port')}`;
const agent = chai.request.agent(server);

before(prepareDatabase);
beforeEach(cleanDatabase);

describe('Rooms', () => {
  it('should create a room', async () => {
    const res = await chai.request(url).post('/rooms/room_1');
    expect(res.body).to.have.property('room');
    expect(res.body.room).to.have.property('name').to.be.equal('room_1');
    expect(res.body.room).to.have.property('users').to.has.length(1);
    expect(res.body.room.users[0].owner).to.be.equal(true);
    expect(res).to.have.status(201);
  });

  it('should join a room', async () => {
    const res = await chai.request(url).post('/rooms/room_1');
    expect(res.body).to.have.property('room');
    expect(res.body.room).to.have.property('name').to.be.equal('room_1');
    expect(res.body.room).to.have.property('users').to.has.length(2);
    expect(res.body.room.users[0].owner).to.be.equal(true);
    expect(res.body.room.users[1].owner).to.be.equal(false);
    expect(res).to.have.status(200);
  });

  it('should get all rooms', async () => {
    await loginAsAdmin(agent);

    const res = await agent.get('/rooms');
    expect(res.body).to.have.property('rooms').to.has.length(1);
    expect(res.body.rooms[0]).to.have.property('name').to.be.equal('room_1');
    expect(res).to.have.status(200);
  });

  it('should get one room', async () => {
    await loginAsAdmin(agent);

    const res = await agent.get('/rooms/room_1');
    expect(res.body).to.have.property('room');
    expect(res.body.room).to.have.property('name').to.be.equal('room_1');
    expect(res.body.room).to.have.property('users').to.has.length(2);
    expect(res).to.have.status(200);
  });

  it('should get 404', async () => {
    await loginAsAdmin(agent);

    const res = await agent.get('/rooms/room_2');
    expect(res).to.have.status(404);
  });

  it('should delete a room', async () => {
    await loginAsAdmin(agent);

    const res = await agent.delete('/rooms/room_1');
    expect(res.body).to.have.property('room');
    expect(res.body.room).to.have.property('name').to.be.equal('room_1');
    expect(res).to.have.status(200);
  });
});

setTimeout(() => run(), 3000);
