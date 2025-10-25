// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../backend-node/models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);


        const admin = await User.create({
            name: 'Admin',
            phone: "9701677607" ,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin'
        });

        console.log('Admin created:', admin);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
