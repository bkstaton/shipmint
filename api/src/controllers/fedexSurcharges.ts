import express, { Request, Response } from 'express';
import { FedexSurcharge } from '../models';

const fedexSurcharges = express.Router();

fedexSurcharges.get('/', (_req: Request, res: Response) => {
    res.send();
});

interface PutRequest {
    type: string;
    charge: number;
}

fedexSurcharges.put('/', (req: Request<{}, {}, PutRequest, {}>, res: Response) => {
    FedexSurcharge.findOrCreate({
        where: {
            type: req.body.type,
        },
    }).then(([surcharge, _created]: [FedexSurcharge, boolean]) => {
        surcharge.charge = req.body.charge;

        return surcharge.save();
    }).then(surcharge => {
        res.send({
            id: surcharge.id,
            type: surcharge.type,
            charge: surcharge.charge,
        });
    }).catch(e => {
        res.status(500).send(e);
    });
});

export default fedexSurcharges;
