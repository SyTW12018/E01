import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose'; // eslint-disable-line import/no-extraneous-dependencies
import User from '../models/User';
import UserService from '../services/UserService';

const mockgoose = new Mockgoose(mongoose);

async function prepareDatabase() {
  await mockgoose.prepareStorage();
  await mongoose.connect('mongodb://videocon.io/test', { useNewUrlParser: true });
}

async function cleanDatabase() {
  await User.deleteMany();

  await User.create({
    cuid: 'cjoogdu2x0000gctsqv3m95nd',
    name: 'Juan',
    email: 'juan@juan.com',
    password: 'juanjuan',
    slug: 'juan',
  });

  await User.create({
    cuid: 'cjoofresr00001ktst8obwhbs',
    name: 'May',
    email: 'may@may.com',
    password: 'maymay',
    slug: 'may',
  });

  await User.create({
    cuid: 'cjoogsdfx0000hytsqgs3msgh',
    name: 'Alberto',
    email: 'alberto@alberto.com',
    password: 'albertoalberto',
    slug: 'alberto',
  });

  await UserService.removeTemporalUsers();
}

export { cleanDatabase, prepareDatabase };
