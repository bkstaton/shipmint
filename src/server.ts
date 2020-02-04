import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import fileUpload from 'express-fileupload';

import customers from './controllers/customers';
import reports from './controllers/reports';

dotenv.config();

// Workaround for Docker not sending Ctrl-C to process correctly
process.on('SIGINT', () => process.exit());

const port = process.env.PORT || 3000;

const app: express.Application = express();

app.use(express.json());

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.get('/', (req: Request, res: Response) => res.send('Hello World!'));

app.use('/customers', customers);
app.use('/reports', reports);

app.listen(port, () => console.log(`Listening on port ${port}`));
