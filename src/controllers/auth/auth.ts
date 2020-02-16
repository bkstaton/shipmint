import express, { Request, Response } from 'express';

import google from './google';
import passport from 'passport';

const auth = express.Router();

auth.use('/google', google);

auth.get('/logout', (req: Request, res: Response) => {
    req.logout();

    res.redirect('/');
});

export default auth;