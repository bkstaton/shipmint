import express, { Request, Response } from 'express';

const customers = express.Router();

customers.post('/', (req: Request, res: Response) => {
    //TODO: create customer in database
    
    res.send({
        id: Math.floor(Math.random() * 10000),
        name: req.body.name,
    });
});

customers.get('/:id', (req: Request, res: Response) => {
    //TODO: load customers from database
    
    res.send({
        id: req.params.id,
        name: 'Apple',
    });
});

export default customers;
