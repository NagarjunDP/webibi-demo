const { signToken } = require('./src/lib/authSession');
require('dotenv').config({ path: '.env.local' });

const token = signToken({ phoneNumber: '+918792248260', role: 'agent' });
console.log(token);
