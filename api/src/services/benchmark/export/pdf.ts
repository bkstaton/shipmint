import { Benchmark } from "../../../models";

import PDFPrinter from 'pdfmake';
import { Column } from "pdfmake/interfaces";
import summarize from "../summarize";

const pdf = async (customerId: string, benchmarkId: string) => {
    const benchmark = await Benchmark.findOne({
        where: {
            id: benchmarkId,
            customerId,
        }
    });

    if (benchmark === null) {
        return null;
    }
    
    const charges = await summarize(benchmark);

    const doc = new PDFPrinter({
        Raleway: {
            normal: 'fonts/Raleway/Raleway Regular.ttf',
            bold: 'fonts/Raleway/Raleway Bold.ttf',
        }
    });

    const formatMoney = (money: number) => {
        return money.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    };

    const moneyCell = (money: number): Column => {
        return {
            columns: [
                {
                    text: '$',
                    width: 'auto',
                },
                {
                    text: formatMoney(money),
                    width: '*',
                    alignment: 'right' as 'right',
                    margin: [0, 0, 0, 0],
                },
            ],
            width: '*',
        };
    };

    const moneySummary = (money: number): Column => {
        return {
            columns: [
                {
                    text: '$',
                    width: 'auto',
                },
                {
                    text: formatMoney(money),
                    width: '*',
                    alignment: 'right' as 'right',
                    margin: [0, 0, 0, 0],
                },
            ],
            width: '*',
            style: ['summaryCell'],
        };
    };

    const groundCharge = charges.charges.find((c) => {
        return c.type === 'FedEx Ground';
    });
    const expressCharge = charges.charges.find((c) => {
        return c.type === 'FedEx Express';
    });
    const surchargeCharge = charges.surcharges;

    const sampleTargetDelta = charges.netTotal.sample - charges.projectedTotal.sample;
    const targetDelta = charges.netTotal.annualization - charges.projectedTotal.annualization;

    const docDefinition = {
        content: [
            {
                columns: [
                    {
                        columns: [
                            {
                                image: 'images/full-logo.png',
                                width: 180,
                                alignment: 'center' as 'center',
                            },
                        ],
                        width: '*',
                    } as Column,
                    [
                        {
                            text: (await benchmark.getCustomer()).name,
                            style: {
                                bold: true,
                                fontSize: 18,
                            },
                        },
                        {
                            text: 'FedEx Benchmark',
                            style: {
                                bold: true,
                                fontSize: 14,
                            },
                        }
                    ],
                ]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '17.5%', '17.5%', '15%'],
                    body: [
                        [
                            { text: 'Current Transportation Charge Amount (Gross)', style: 'tableHeader'},
                            { text: 'Sample', style: ['tableHeader', 'centered']},
                            { text: 'Annualized', style: ['tableHeader', 'centered']},
                            { text: '', style: ['tableHeader', 'centered']},
                        ],
                        [
                            'FedEx Ground',
                            moneyCell(groundCharge ? groundCharge.grossCharge.sample : 0),
                            moneyCell(groundCharge ? groundCharge.grossCharge.annualization : 0),
                            '',
                        ],
                        [
                            'FedEx Express',
                            moneyCell(expressCharge ? expressCharge.grossCharge.sample : 0),
                            moneyCell(expressCharge ? expressCharge.grossCharge.annualization : 0),
                            '',
                        ],
                        [
                            'Fees and Surcharges',
                            moneyCell(surchargeCharge ? surchargeCharge.grossCharge.sample : 0),
                            moneyCell(surchargeCharge ? surchargeCharge.grossCharge.annualization : 0),
                            '',
                        ],
                        [
                            { text: 'Total', style: 'tableTotal' },
                            moneyCell(charges.grossTotal.sample),
                            moneyCell(charges.grossTotal.annualization),
                            '',
                        ],
                    ],
                },
                layout: 'default',
                margin: [0, 15, 0, 10] as [number, number, number, number],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '17.5%', '17.5%', '15%'],
                    body: [
                        [
                            { text: 'Current Net Charge Amount', style: 'tableHeader'},
                            { text: 'Sample', style: ['tableHeader', 'centered']},
                            { text: 'Annualized', style: ['tableHeader', 'centered']},
                            { text: 'Discounts', style: ['tableHeader', 'centered']},
                        ],
                        [
                            'FedEx Ground',
                            moneyCell(groundCharge ? groundCharge.netCharge.sample : 0),
                            moneyCell(groundCharge ? groundCharge.netCharge.annualization : 0),
                            { text: (groundCharge ? groundCharge.netCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            'FedEx Express',
                            moneyCell(expressCharge ? expressCharge.netCharge.sample : 0),
                            moneyCell(expressCharge ? expressCharge.netCharge.annualization : 0),
                            { text: (expressCharge ? expressCharge.netCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            'Fees and Surcharges',
                            moneyCell(surchargeCharge ? surchargeCharge.netCharge.sample : 0),
                            moneyCell(surchargeCharge ? surchargeCharge.netCharge.annualization : 0),
                            { text: (surchargeCharge ? surchargeCharge.netCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            { text: 'Subtotal', style: 'tableTotal' },
                            moneyCell(charges.netTotal.sample),
                            moneyCell(charges.netTotal.annualization),
                            { text: (charges.netTotal.discount).toFixed(1) + '%', style: ['discountCell', 'tableTotal'] },
                        ],
                    ]
                },
                layout: 'default',
                margin: [0, 0, 0, 10] as [number, number, number, number],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '17.5%', '17.5%', '15%'],
                    body: [
                        [
                            { text: 'Projected Net Charge Amount', style: 'tableHeader'},
                            { text: 'Sample', style: ['tableHeader', 'centered']},
                            { text: 'Annualized', style: ['tableHeader', 'centered']},
                            { text: 'Discounts', style: ['tableHeader', 'centered']},
                        ],
                        [
                            'FedEx Ground',
                            moneyCell(groundCharge ? groundCharge.projectedCharge.sample : 0),
                            moneyCell(groundCharge ? groundCharge.projectedCharge.annualization : 0),
                            { text: (groundCharge ? groundCharge.projectedCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            'FedEx Express',
                            moneyCell(expressCharge ? expressCharge.projectedCharge.sample : 0),
                            moneyCell(expressCharge ? expressCharge.projectedCharge.annualization : 0),
                            { text: (expressCharge ? expressCharge.projectedCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            'Fees and Surcharges',
                            moneyCell(surchargeCharge ? surchargeCharge.projectedCharge.sample : 0),
                            moneyCell(surchargeCharge ? surchargeCharge.projectedCharge.annualization : 0),
                            { text: (surchargeCharge ? surchargeCharge.projectedCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            { text: 'Total', style: 'tableTotal' },
                            moneyCell(charges.projectedTotal.sample),
                            moneyCell(charges.projectedTotal.annualization),
                            { text: (charges.projectedTotal.discount).toFixed(1) + '%', style: ['discountCell', 'tableTotal'] },
                        ],
                    ]
                },
                layout: 'default',
                margin: [0, 0, 0, 10] as [number, number, number, number],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '17.5%', '17.5%', '15%'],
                    body: [
                        [
                            { text: 'Projected Annual Savings', style: ['summaryCell']},
                            moneySummary(sampleTargetDelta),
                            moneySummary(targetDelta),
                            {
                                text: (targetDelta / charges.netTotal.annualization * 100).toFixed(1) + '%',
                                style: ['discountCell', 'summaryCell'],
                            },
                        ],
                    ]
                },
                layout: 'summary',
            },
        ],
        defaultStyle: {
            font: 'Raleway',
            fontSize: 10,
            color: '#24303F',
            lineHeight: 1.25,
        },
        styles: {
            tableHeader: {
                color: 'white',
                bold: true,
                margin: [0, 2, 0, 0] as [number, number, number, number],
            },
            centered: {
                alignment: 'center' as 'center',
            },
            tableTotal: {
                bold: true,
            },
            discountCell: {
                alignment: 'center' as 'center',
            },
            summaryCell: {
                color: 'white',
                bold: true,
                lineHeight: 1.5,
                margin: [0, 6, 0, 0] as [number, number, number, number],
            },
        },
        pageMargins: 54,
    };

    const pdf = doc.createPdfKitDocument(
        docDefinition,
        {
            tableLayouts: {
                default: {
                    defaultBorder: false,
                    fillColor: (rowIndex: number) => rowIndex === 0 ? '#24303F': null,
                },
                summary: {
                    defaultBorder: false,
                    fillColor: '#75C697',
                },
            }
        }
    );

    return pdf;
};

export default pdf;
