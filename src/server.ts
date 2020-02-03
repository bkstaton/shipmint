import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config();

// Workaround for Docker not sending Ctrl-C to process correctly
process.on('SIGINT', () => process.exit());

const port = process.env.PORT || 3000;

const app: express.Application = express();

app.get('/', (req: Request, res: Response) => res.send('Hello World!'));

app.listen(port, () => console.log(`Listening on port ${port}`));
