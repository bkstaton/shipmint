import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import path from 'path';
import passport from 'passport';

import { requireAuth } from './authentication/middleware';
import auth from './controllers/auth/auth';
import customers from './controllers/customers';
import reports from './controllers/reports';
import user from './controllers/user';

// Workaround for Docker not sending Ctrl-C to process correctly
process.on('SIGINT', () => process.exit());

const port = process.env.PORT || 3000;

const app: express.Application = express();

app.use(session({ secret: 'keyboard cat' }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use('/auth', auth);

const api = express.Router();

api.use('/user', requireAuth, user);
api.use('/customers', requireAuth, customers);
api.use('/reports', requireAuth, reports);

app.use('/api', api);

app.use(express.static(path.join(__dirname, 'app', 'build')));

app.get('/*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'app', 'build', 'index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
