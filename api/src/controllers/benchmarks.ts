import express, { Request, Response } from 'express';
import { read, create, find, updateTotal, downloadFile, updateSurcharge, del } from '../services/benchmark';
import exportPdf from '../services/benchmark/export/pdf';

const benchmarks = express.Router({ mergeParams: true });

benchmarks.get('/', (req: Request, res: Response) => {
    const customerId = req.params.customerId;

    find(customerId).then(b => res.send(b)).catch(e => res.status(500).send(e));
});

benchmarks.post('/', (req: Request, res: Response) => {
    if (!req.files || !req.files.report || Array.isArray(req.files.report)) {
        res.status(400).send('Single report file is required.');
        return;
    }

    const customerId = req.params.customerId;

    const report = req.files.report;

    create(customerId, report.name, report.data)
        .then(b => res.send(b))
        .catch(e => {
            console.log(e);

            res.status(500).send({
                error: e.message,
            });
        });
});

benchmarks.get('/:benchmarkId', (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const benchmarkId = req.params.benchmarkId;

    read(customerId, benchmarkId).then(b => res.send(b)).catch(e => res.status(500).send(e));
});

benchmarks.delete('/:benchmarkId', (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const benchmarkId = req.params.benchmarkId;

    del(customerId, benchmarkId).then(b => res.send(b)).catch(e => res.status(500).send(e));
});

benchmarks.patch('/:benchmarkId/totals/:totalId', (req: Request, res: Response) => {
    const benchmarkId = req.params.benchmarkId;
    const totalId = req.params.totalId;

    const targetDiscount = req.body.targetDiscount;

    updateTotal(benchmarkId, totalId, targetDiscount).then(t => res.send(t)).catch(e => res.status(500).send(e));
});

benchmarks.patch('/:benchmarkId/surcharges/:totalId', (req: Request, res: Response) => {
    const benchmarkId = req.params.benchmarkId;
    const surchargeId = req.params.totalId;

    const publishedCharge = req.body.publishedCharge;
    const targetDiscount = req.body.targetDiscount;

    updateSurcharge(benchmarkId, surchargeId, publishedCharge, targetDiscount).then(t => res.send(t)).catch(e => res.status(500).send(e));
});

benchmarks.get('/:benchmarkId/file', (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const benchmarkId = req.params.benchmarkId;

    downloadFile(customerId, benchmarkId).then(f => {
        if (f === null) {
            res.status(404).send();
            return;
        }

        res.download(f.tmpName, f.name);
    }).catch(e => res.status(500).send(e));
});

benchmarks.get('/:benchmarkId/export', (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const benchmarkId = req.params.benchmarkId;

    exportPdf(customerId, benchmarkId).then(pdf => {
        if (pdf === null) {
            res.status(404).send();
            return;
        }

        pdf.pipe(res);
        pdf.end();
    }).catch(e => {
        console.log(e);

        res.status(500).send(e);
    });
});

export default benchmarks;
