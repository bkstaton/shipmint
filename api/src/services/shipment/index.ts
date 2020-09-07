import { Shipment, InvoiceUpload } from "../../models";
import parseFedex from './parser/fedex';
import { upload } from '../files';

export const create = async (customerId: string, displayName: string, report: Buffer): Promise<void> => {
    await parseFedex(customerId, report);

    const invoiceUpload = await InvoiceUpload.create({
        customerId,
        file: displayName,
    });

    await upload(`invoice_uploads/${invoiceUpload.id}.csv`, report);
};

export const find = async (customerId: string) => {
    return await Shipment.findAll({ where: { customerId } });
};

export const read = async (customerId: string, shipmentId: string) => {
    const shipment = await Shipment.findOne({
        where: {
            id: shipmentId,
            customerId,
        }
    });

    if (shipment === null) {
        return null;
    }

    return {
        id: shipment.id,

    };
};
