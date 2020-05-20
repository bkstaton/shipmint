import { Benchmark, BenchmarkTotal, BenchmarkSurcharge } from "../../models";
import parseFedex from '../benchmark/parser/fedex';
import calculate from '../benchmark/calculate';
import { upload, download } from './files';

export const create = async (customerId: string, report: Buffer) => {
    const benchmark = await parseFedex(customerId, report);

    await upload(benchmark.id.toString() + '.csv', report);

    benchmark.file = benchmark.id.toString() + '.csv';
    await benchmark.save();

    return await calculate(benchmark);
};

export const find = async (customerId: string) => {
    return await Benchmark.findAll({ where: { customerId } });
};

export const read = async (customerId: string, benchmarkId: string) => {
    const benchmark = await Benchmark.findOne({
        where: {
            id: benchmarkId,
            customerId,
        }
    });

    if (benchmark === null) {
        return null;
    }

    return await calculate(benchmark);
};

export const updateTotal = async (benchmarkId: string, totalId: string, targetDiscount: number) => {
    const total = await BenchmarkTotal.findOne({
        where: {
            id: totalId,
            benchmarkId,
        }
    });

    if (total === null) {
        return null;
    }

    total.targetDiscount = targetDiscount;
    await total.save();

    return total;
};

export const updateSurcharge = async (benchmarkId: string, surchargeId: string, publishedCharge: number) => {
    const surcharge = await BenchmarkSurcharge.findOne({
        where: {
            id: surchargeId,
            benchmarkId,
        }
    });

    if (surcharge === null) {
        return null;
    }

    surcharge.publishedCharge = publishedCharge;
    await surcharge.save();

    return surcharge;
};

export const downloadFile = async (customerId: string, benchmarkId: string): Promise<{tmpName: string, name: string} | null> => {
    const benchmark = await Benchmark.findOne({
        where: {
            id: benchmarkId,
            customerId,
        }
    });

    if (benchmark === null) {
        return null;
    }

    const tmpName = await download(benchmark.id.toString() + '.csv');

    if (!tmpName) {
        return null;
    }

    return {
        tmpName,
        name: benchmark.file,
    };
};
