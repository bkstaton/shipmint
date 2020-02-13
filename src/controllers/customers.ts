import express, { Request, Response } from 'express';

const customers = express.Router();

const customerData = [
    {
        id: 1,
        name: 'Apple',
    },
    {
        id: 2,
        name: 'Zappos',
    },
];

customers.get('/', (req: Request, res: Response) => {
    //TODO load customers from database

    res.send(customerData);
});

customers.post('/', (req: Request, res: Response) => {
    //TODO: create customer in database
    
    res.send({
        id: Math.floor(Math.random() * 10000),
        name: req.body.name,
    });
});

customers.get('/:id', (req: Request, res: Response) => {
    //TODO: load customers from database
    
    res.send(customerData.find(c => c.id.toString() === req.params.id));
});

export default customers;
