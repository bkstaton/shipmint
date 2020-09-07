import express, { Request, Response } from 'express';
import calculate from '../../services/customer/summary/calculate';
import { Carrier } from '../../models';
import summarize from '../../services/customer/summary';

const summary = express.Router({ mergeParams: true });

summary.get('/', (req: Request, res: Response) => {
    const customerId = req.params.customerId;

    calculate(customerId, Carrier.FedEx)
        .then(c => summarize(c))
        .then(s => res.send(s))
        .catch(e => res.status(500).send(e));
});

export default summary;
