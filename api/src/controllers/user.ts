import express, { Request, Response } from 'express';
import { User } from '../models';

const user = express.Router();

user.get('/', (req: Request, res: Response) => {
    if (req.user) {
        const user = req.user as User;

        res.send({
            name: user.name,
            email: user.email,
            googleProfileId: user.googleId,
        });

        return;
    }

    res.status(201).send(null);
});

export default user;
