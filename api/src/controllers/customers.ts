import express, { Request, Response } from 'express';
import { Customer } from '../models';
import summary from './customers/summary';
import benchmark from './customers/benchmark';
import shipments from './customers/shipments';
import discounts from './customers/discounts';
import surchargeDiscounts from './customers/surcharge_discounts';
import charges from './customers/charges';

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

customers.use('/:customerId/summary', summary);

customers.use('/:customerId/charges', charges);

customers.use('/:customerId/benchmark', benchmark);

customers.use('/:customerId/shipments', shipments);

customers.use('/:customerId/discounts', discounts);

customers.use('/:customerId/surcharge-discounts', surchargeDiscounts);

export default customers;
