const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ override: true });

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');
        const user = new User({ name: 'test', email: 'testx' + Date.now() + '@test.com', password: 'abc' });
        await user.save();
        console.log('Saved');
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}
test();
