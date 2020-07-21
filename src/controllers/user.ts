import express, { Request, Response } from 'express';

const user = express.Router();

user.get('/', (req: Request, res: Response) => {
    if (req.user) {
        res.send({
            googleProfileId: (req.user as any).googleProfileId
        });

        return;
    }

    res.status(201).send(null);
});

export default user;
