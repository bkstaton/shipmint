import express, { Request, Response } from 'express';
import benchmarks from './benchmarks';
import { Customer } from '../models';

const customers = express.Router();

customers.get('/', (_req: Request, res: Response) => {
    Customer.findAll().then(c =>res.send(c) );
});

customers.post('/', (req: Request, res: Response) => {
    const name = req.body.name;

    Customer.create({
        name
    }).then(c => res.send(c));

});

customers.get('/:customerId', (req: Request, res: Response) => {

    
    Customer.findOne({where: {id : req.params.customerId}}).then(c => res.send(c));
});

customers.use('/:customerId/benchmarks', benchmarks);

export default customers;
