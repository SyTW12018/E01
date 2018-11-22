import User from '../models/User';
import UserService from '../services/UserService';

// TODO base de datos de pruebas

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

export { cleanDatabase };
