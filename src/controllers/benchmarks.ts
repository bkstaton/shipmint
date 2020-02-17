import express, { Request, Response } from 'express';

import parseFedex from '../services/benchmark/parser/fedex';
import calculate from '../services/benchmark/calculate';

const benchmarks = express.Router({ mergeParams: true });

benchmarks.post('/', (req: Request, res: Response) => {
    if (!req.files || !req.files.report || Array.isArray(req.files.report)) {
        res.status(400).send('Single report file is required.');
        return;
    }
    
    const report = req.files.report;

    const benchmarks = calculate(parseFedex(report.data));

    res.send({
        customerId: req.params.customerId,
        name: report.name,
        benchmarks,
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
