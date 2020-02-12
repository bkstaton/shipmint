import express, { Request, Response } from 'express';
import benchmarks from './benchmarks';

const customers = express.Router();

customers.post('/', (req: Request, res: Response) => {
    //TODO: create customer in database
    
    res.send({
        id: Math.floor(Math.random() * 10000),
        name: req.body.name,
    });
});

customers.get('/:customerId', (req: Request, res: Response) => {
    //TODO: load customers from database
    
    res.send({
        id: req.params.id,
        name: 'Apple',
    });
});

customers.use('/:customerId/benchmarks', benchmarks);

export default customers;
