import { S3 } from 'aws-sdk';
import tmp from 'tmp';
import fs from 'fs';

export const upload = async (name: string, file: Buffer) => {
    if (!process.env.AWS_ACCESS_KEY_ID) {
        return;
    }

    const s3 = new S3({ apiVersion: '2006-03-01' });

    await s3.upload({
        Key: name,
        Bucket: process.env.AWS_BUCKET || '',
        Body: file,
    }).promise();
}

export const download = async (name: string): Promise<string | null> => {
    if (!process.env.AWS_ACCESS_KEY_ID) {
        return null;
    }

    const s3 = new S3({ apiVersion: '2006-03-01' });

    const response = await s3.getObject({
        Key: name,
        Bucket: process.env.AWS_BUCKET || '',
    }).promise();

    if (!response.Body) {
        return null;
    }

    try {
        const file = tmp.fileSync();

        fs.writeSync(file.fd, response.Body.toString());
        fs.closeSync(file.fd);

        return file.name;
    }
    catch (e) {
        return null;
    }
};
