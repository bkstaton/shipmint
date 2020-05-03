import express, { Request, Response } from 'express';
import { read, find, create, del, update } from '../services/fedex_shipping_methods';

const fedexShippingMethods = express.Router();

fedexShippingMethods.get('/', (req: Request, res: Response) => {
    find().then(m => res.send(m));
});

fedexShippingMethods.get('/:fedexShippingMethodId', (req: Request, res: Response) => {
    const fedexShippingMethodId = parseInt(req.params.fedexShippingMethodId, 10);

    read(fedexShippingMethodId).then(m => res.send(m)).catch(e => res.status(500).send(e));
});

fedexShippingMethods.post('/', (req: Request, res: Response) => {
    create(req.body).then(m => res.send(m)).catch(e => res.status(500).send(e));
});

fedexShippingMethods.patch('/:fedexShippingMethodId', (req: Request, res: Response) => {
    const fedexShippingMethodId = parseInt(req.params.fedexShippingMethodId, 10);

    update(fedexShippingMethodId, req.body).then(m => res.send(m)).catch(e => res.status(500).send(e));
});

fedexShippingMethods.delete('/:fedexShippingMethodId', (req: Request, res: Response) => {
    const fedexShippingMethodId = parseInt(req.params.fedexShippingMethodId, 10);

    del(fedexShippingMethodId).then(() => res.send()).catch(e => res.status(500).send(e));
});

export default fedexShippingMethods;
