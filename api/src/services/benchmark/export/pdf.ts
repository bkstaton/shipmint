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

    const groundCharge = charges.charges.find((c) => {
        return c.type === 'FedEx Ground';
    });
    const expressCharge = charges.charges.find((c) => {
        return c.type === 'FedEx Express';
    });
    const surchargeCharge = charges.charges.find((c) => {
        return c.type === 'Surcharges';
    });

    const targetDelta = charges.netTotal.annualization - charges.projectedTotal.annualization;
    const targetDiscount = 100.0 * targetDelta / charges.grossTotal.annualization;

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
                    {
                        text: 'Projection Summary',
                        width: '*',
                        style: {
                            bold: true,
                            fontSize: 16,
                        },
                        margin: [0, 30, 0, 0] as [number, number, number, number],
                    } as Column,
                ]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '15%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Current Transportation Charge Amount (Gross)', style: 'tableHeader'},
                            { text: 'Sample', style: 'tableHeader'},
                            { text: 'Annualization', style: 'tableHeader'},
                            { text: '', style: 'tableHeader'},
                        ],
                        [
                            'FedEx Ground',
                            { text: '$' + formatMoney(groundCharge ? groundCharge.grossCharge.sample : 0), style: 'moneyCell' },
                            { text: '$' + formatMoney(groundCharge ? groundCharge.grossCharge.annualization : 0), style: 'moneyCell' },
                            '',
                        ],
                        [
                            'FedEx Express',
                            { text: '$' + formatMoney(expressCharge ? expressCharge.grossCharge.sample : 0), style: 'moneyCell' },
                            { text: '$' + formatMoney(expressCharge ? expressCharge.grossCharge.annualization : 0), style: 'moneyCell' },
                            '',
                        ],
                        [
                            'Fees and Surcharges',
                            { text: '$' + formatMoney(surchargeCharge ? surchargeCharge.grossCharge.sample : 0), style: 'moneyCell' },
                            { text: '$' + formatMoney(surchargeCharge ? surchargeCharge.grossCharge.annualization : 0), style: 'moneyCell' },
                            '',
                        ],
                        [
                            { text: 'Total', style: 'tableTotal' },
                            { text: '$' + formatMoney(charges.grossTotal.sample), style: ['moneyCell', 'tableTotal']},
                            { text: '$' + formatMoney(charges.grossTotal.annualization), style: ['moneyCell', 'tableTotal'] },
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
                    widths: ['*', '15%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Current Net Charge Amount', style: 'tableHeader'},
                            { text: 'Sample', style: 'tableHeader'},
                            { text: 'Annualization', style: 'tableHeader'},
                            { text: 'Discounts', style: 'tableHeader'},
                        ],
                        [
                            'FedEx Ground',
                            { text: '$' + formatMoney(groundCharge ? groundCharge.netCharge.sample : 0), style: 'moneyCell' },
                            { text: '$' + formatMoney(groundCharge ? groundCharge.netCharge.annualization : 0), style: 'moneyCell' },
                            { text: (groundCharge ? groundCharge.netCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            'FedEx Express',
                            { text: '$' + formatMoney(expressCharge ? expressCharge.netCharge.sample : 0), style: 'moneyCell' },
                            { text: '$' + formatMoney(expressCharge ? expressCharge.netCharge.annualization : 0), style: 'moneyCell' },
                            { text: (expressCharge ? expressCharge.netCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            'Fees and Surcharges',
                            { text: '$' + formatMoney(surchargeCharge ? surchargeCharge.netCharge.sample : 0), style: 'moneyCell' },
                            { text: '$' + formatMoney(surchargeCharge ? surchargeCharge.netCharge.annualization : 0), style: 'moneyCell' },
                            { text: (surchargeCharge ? surchargeCharge.netCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            { text: 'Subtotal', style: 'tableTotal' },
                            { text: '$' + formatMoney(charges.netTotal.sample), style: ['moneyCell', 'tableTotal'] },
                            { text: '$' + formatMoney(charges.netTotal.annualization), style: ['moneyCell', 'tableTotal'] },
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
                    widths: ['*', '15%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Projected Net Charge Amount', style: 'tableHeader'},
                            { text: '', style: 'tableHeader'},
                            { text: 'Annualization', style: 'tableHeader'},
                            { text: 'Discounts', style: 'tableHeader'},
                        ],
                        [
                            'FedEx Ground',
                            '',
                            { text: '$' + formatMoney(groundCharge ? groundCharge.projectedCharge.annualization : 0), style: 'moneyCell' },
                            { text: (groundCharge ? groundCharge.projectedCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            'FedEx Express',
                            '',
                            { text: '$' + formatMoney(expressCharge ? expressCharge.projectedCharge.annualization : 0), style: 'moneyCell' },
                            { text: (expressCharge ? expressCharge.projectedCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            'Fees and Surcharges',
                            '',
                            { text: '$' + formatMoney(surchargeCharge ? surchargeCharge.projectedCharge.annualization : 0), style: 'moneyCell' },
                            { text: (surchargeCharge ? surchargeCharge.projectedCharge.discount : 0).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            { text: 'Total', style: 'tableTotal' },
                            '',
                            { text: '$' + formatMoney(charges.projectedTotal.annualization), style: ['moneyCell', 'tableTotal'] },
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
                    widths: ['*', '15%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Gross Cost Savings', style: 'tableHeader'},
                            { text: '', style: 'tableHeader'},
                            { text: 'Annualization', style: 'tableHeader'},
                            { text: 'Percentage', style: 'tableHeader'},
                        ],
                        [
                            { text: 'Target Delta', style: 'tableTotal' },
                            '',
                            { text: '$' + formatMoney(targetDelta), style: ['moneyCell', 'tableTotal'] },
                            { text: (targetDiscount).toFixed(1) + '%', style: ['discountCell', 'tableTotal'] },
                        ],
                    ]
                },
                layout: 'default',
                margin: [0, 0, 0, 10] as [number, number, number, number],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '15%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Fees/Commissions', style: 'tableHeader'},
                            { text: '', style: 'tableHeader'},
                            { text: 'Estimated', style: 'tableHeader'},
                            { text: 'Gain Share', style: 'tableHeader'},
                        ],
                        [
                            'ShipMint Fee',
                            '',
                            { text: '$' + formatMoney(targetDelta * 0.30), style: 'moneyCell' },
                            { text: '30%', style: 'discountCell' },
                        ],
                    ]
                },
                layout: 'default',
                margin: [0, 0, 0, 10] as [number, number, number, number],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '15%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Projected Net Cost Savings', style: 'tableHeader'},
                            { text: '', style: 'tableHeader'},
                            { text: 'Annualization', style: 'tableHeader'},
                            { text: 'Percentage', style: 'tableHeader'},
                        ],
                        [
                            'Net Savings (Year 1)',
                            '',
                            {
                                text: '$' + formatMoney(targetDelta * 0.7),
                                style: 'moneyCell',
                            },
                            {
                                text: (targetDelta * 0.7 / charges.netTotal.annualization * 100).toFixed(1) + '%',
                                style: 'discountCell',
                            },
                        ],
                        [
                            'Net Savings (Year 2)',
                            '',
                            {
                                text: '$' + formatMoney(targetDelta * 0.7),
                                style: 'moneyCell',
                            },
                            {
                                text: (targetDelta * 0.7 / charges.netTotal.annualization * 100).toFixed(1) + '%',
                                style: 'discountCell',
                            },
                        ],
                        [
                            'Net Savings (Year 3)',
                            '',
                            {
                                text: '$' + formatMoney(targetDelta * 0.7),
                                style: 'moneyCell',
                            },
                            {
                                text: (targetDelta * 0.7 / charges.netTotal.annualization * 100).toFixed(1) + '%',
                                style: 'discountCell',
                            },
                        ],
                    ]
                },
                layout: 'default',
                margin: [0, 0, 0, 10] as [number, number, number, number],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '15%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Total Savings (3-year Term)', style: ['tableHeader', 'summaryCell']},
                            { text: '', style: ['tableHeader', 'summaryCell']},
                            {
                                text: '$' + formatMoney(targetDelta * 0.7 * 3),
                                    style: ['moneyCell', 'tableHeader', 'summaryCell'],
                            },
                            {
                                text: (targetDelta * 0.7 / charges.netTotal.annualization * 100).toFixed(1) + '%',
                                    style: ['discountCell', 'tableHeader', 'summaryCell'],
                            },
                        ],
                    ]
                },
                layout: 'summary',
                margin: [0, 0, 0, 10] as [number, number, number, number],
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
            },
            tableTotal: {
                bold: true,
            },
            moneyCell: {
                alignment: 'right' as 'right',
            },
            discountCell: {
                alignment: 'center' as 'center',
            },
            summaryCell: {
                lineHeight: 2,
                fontSize: 10.5,
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
