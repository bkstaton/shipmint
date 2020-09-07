import express, { Request, Response } from 'express';
import exportPdf from '../../services/benchmark/export/pdf';

const benchmark = express.Router({ mergeParams: true });

benchmark.get('/export', (req: Request, res: Response) => {
    const customerId = req.params.customerId;

    exportPdf(customerId).then(pdf => {
        if (pdf === null) {
            res.status(404).send();
            return;
        }
        res.set('Content-Type', 'application/pdf')
            .set('Content-Disposition', 'attachment; filename="Benchmark.pdf"');

        pdf.pipe(res);
        pdf.end();
    }).catch(e => {
        console.log(e);

        res.status(500).send(e);
    });
});

export default benchmark;
