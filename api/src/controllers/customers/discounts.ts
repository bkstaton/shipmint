import express, { Request, Response } from 'express';
import { CustomerDiscount } from '../../models';

const discounts = express.Router({ mergeParams: true });

interface PutRequest {
    method: string;
    bucket: string;
    discount: number;
}

discounts.put('/', (req: Request<{customerId: string}, {}, PutRequest, {}>, res: Response) => {
    CustomerDiscount.findOrCreate({
        where: {
            customerId: req.params.customerId,
            method: req.body.method,
            bucket: req.body.bucket,
        },
    }).then(([discount, _created]: [CustomerDiscount, boolean]) => {
        discount.discount = req.body.discount;

        return discount.save();
    }).then(discount => {
        res.send({
            id: discount.id,
            method: discount.method,
            bucket: discount.bucket,
            discount: discount.discount,
        });
    }).catch(e => {
        res.status(500).send(e);
    });
});

export default discounts;
