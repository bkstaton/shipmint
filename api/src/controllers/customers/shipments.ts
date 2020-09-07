import express, { Request, Response } from 'express';
import { read, create, find } from '../../services/shipment';

const shipments = express.Router({ mergeParams: true });

shipments.get('/', (req: Request, res: Response) => {
    const customerId = req.params.customerId;

    find(customerId).then(b => res.send(b)).catch(e => res.status(500).send(e));
});

shipments.post('/', (req: Request, res: Response) => {
    if (!req.files || !req.files.report || Array.isArray(req.files.report)) {
        res.status(400).send('Single report file is required.');
        return;
    }

    const customerId = req.params.customerId;

    const report = req.files.report;

    create(customerId, report.name, report.data)
        .then(() => res.send({}))
        .catch(e => {
            console.log(e);

            res.status(500).send({
                error: e.message,
            });
        });
});

shipments.get('/:shipmentId', (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const shipmentId = req.params.shipmentId;

    read(customerId, shipmentId).then(b => res.send(b)).catch(e => res.status(500).send(e));
});

export default shipments;
