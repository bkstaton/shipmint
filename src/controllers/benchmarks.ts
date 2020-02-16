import express, { Request, Response } from 'express';

import parse from '../services/reportParser';

const benchmarks = express.Router({ mergeParams: true });

benchmarks.post('/', (req: Request, res: Response) => {
    if (!req.files || !req.files.report || Array.isArray(req.files.report)) {
        res.status(400).send('Single report file is required.');
        return;
    }
    
    const report = req.files.report;

    res.send({
        customerId: req.body.customerId,
        name: report.name,
        summary: parse(report.data),
    });
});

benchmarks.get('/:benchmarkId', (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const benchmarkId = req.params.benchmarkId;

    res.send({
        customerId,
        benchmarkId,
    });
});

export default benchmarks;
