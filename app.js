import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }))

import user from './routes/user.js';

app.use('/api',user);

app.use('',(req,res) => {
    res.send('Deployed successfully!')
})

app.listen(process.env.PORT, async () => {
    await mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
     .then(() => console.log(`Server is listening on port ${process.env.PORT}`))
     .catch((error) => console.log(error))
})

