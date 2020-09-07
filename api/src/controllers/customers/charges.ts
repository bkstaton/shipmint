import express, { Request, Response } from 'express';
import { Carrier } from '../../models';
import calculate from '../../services/customer/summary/calculate';

const charges = express.Router({ mergeParams: true });

charges.get('', (req: Request<{customerId: string}>, res: Response) => {
    const customerId = req.params.customerId;

    calculate(customerId, Carrier.FedEx)
        .then(s => res.send(s))
        .catch(e => res.status(500).send(e));
});

export default charges;
