import express, { Request, Response } from 'express';
import { CustomerSurchargeDiscount } from '../../models';

const surchargeDiscounts = express.Router({ mergeParams: true });

interface PutRequest {
    type: string;
    actual?: number | null;
    projected?: number | null;
}

surchargeDiscounts.put('/', (req: Request<{customerId: string}, {}, PutRequest, {}>, res: Response) => {
    CustomerSurchargeDiscount.findOrCreate({
        where: {
            customerId: req.params.customerId,
            type: req.body.type,
        },
    }).then(([discount, _created]: [CustomerSurchargeDiscount, boolean]) => {
        if (req.body.actual !== undefined) {
            discount.actual = req.body.actual;
        }
        if (req.body.projected !== undefined) {
            discount.projected = req.body.projected;
        }

        return discount.save();
    }).then(discount => {
        res.send({
            id: discount.id,
            type: discount.type,
            actual: discount.actual,
            projected: discount.projected,
        });
    }).catch(e => {
        res.status(500).send(e);
    });
});

export default surchargeDiscounts;
