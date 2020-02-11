import express, { Request, Response } from 'express';
import { resolveSoa } from 'dns';

const user = express.Router();

user.get('/', (req: Request, res: Response) => {
    if (req.user) {
        res.send({
            googleProfileId: (req.user as any).googleProfileId
        });
    }

    res.status(201).send(null);
});

export default user;
