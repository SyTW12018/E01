import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Mockgoose } from 'mockgoose'; // eslint-disable-line import/no-extraneous-dependencies
import User from '../models/User';
import UserService from '../services/UserService';

const mockgoose = new Mockgoose(mongoose);

async function prepareDatabase() {
  await mockgoose.prepareStorage();
  await mongoose.connect('mongodb://videocon.io/test', { useNewUrlParser: true });
  // await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
}

async function cleanDatabase() {
  await User.deleteMany();

  let passwordHash = await bcrypt.hash('juanjuan', 5);
  await User.create({
    cuid: 'cjoogdu2x0000gctsqv3m95nd',
    name: 'Juan',
    email: 'juan@juan.com',
    password: passwordHash,
    slug: 'juan',
  });

  passwordHash = await bcrypt.hash('maymay', 5);
  await User.create({
    cuid: 'cjoofresr00001ktst8obwhbs',
    name: 'May',
    role: 'admin',
    email: 'may@may.com',
    password: passwordHash,
    slug: 'may',
  });

  passwordHash = await bcrypt.hash('albertoalberto', 5);
  await User.create({
    cuid: 'cjoogsdfx0000hytsqgs3msgh',
    name: 'Alberto',
    email: 'alberto@alberto.com',
    password: passwordHash,
    slug: 'alberto',
  });

  await UserService.removeTemporalUsers();
}

async function loginAsAdmin(agent) {
  return agent.post('/auth/login')
    .send({
      user: {
        email: 'may@may.com',
        password: 'maymay',
      },
    });
}

async function loginAsNotAdmin(agent) {
  return agent.post('/auth/login')
    .send({
      user: {
        email: 'juan@juan.com',
        password: 'juanjuan',
      },
    });
}

export {
  cleanDatabase, prepareDatabase, loginAsAdmin, loginAsNotAdmin,
};
