import express, { Request, Response } from 'express';

import parseFedex from '../services/benchmark/parser/fedex';
import calculate from '../services/benchmark/calculate';
import { Benchmark } from '../models';

const benchmarks = express.Router({ mergeParams: true });

benchmarks.post('/', (req: Request, res: Response) => {
    if (!req.files || !req.files.report || Array.isArray(req.files.report)) {
        res.status(400).send('Single report file is required.');
        return;
    }

    const report = req.files.report;

    parseFedex(report.data).then(benchmark => {
        calculate(benchmark).then(result => res.send(result));
    }).catch(e => res.status(500).send(e));
});

benchmarks.get('/:benchmarkId', (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const benchmarkId = req.params.benchmarkId;

    Benchmark.findOne({
        where: {
            id: benchmarkId,
            customerId,
        }
    }).then(benchmark => {
        if (benchmark === null) {
            res.status(404).send();
            return;
        }

        calculate(benchmark).then(result => res.send(result));
    });
});

export default benchmarks;
