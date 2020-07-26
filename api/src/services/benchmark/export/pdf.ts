import { Benchmark } from "../../../models";

import PDFPrinter from 'pdfmake';
import { Column } from "pdfmake/interfaces";

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
    
    const charges = {} as { [key: string]: any };
    for (const total of await benchmark.getTotals()) {
        const newTotal = charges[total.class] || {
            class: total.class,
            currentTotalCharge: 0,
            currentDiscount: 0,
            projectedDiscount: 0,
        };

        newTotal.currentTotalCharge += total.transportationCharge;

        let totalDiscount = 0;
        for (let d of await total.getDiscounts()) {
            totalDiscount += d.amount;
        }
        newTotal.currentDiscount += totalDiscount;
        newTotal.projectedDiscount -= (total.targetDiscount * total.transportationCharge / 100);

        charges[total.class] = newTotal;
    }

    const surcharges = {
        currentTotalCharge: 0,
        currentDiscount: 0,
        projectedDiscount: 0,
    };
    for (const surcharge of await benchmark.getSurcharges()) {
        surcharges.currentTotalCharge += surcharge.totalCharge;
        surcharges.currentDiscount += surcharge.targetDiscount;
        surcharges.projectedDiscount -= (surcharge.totalCharge * surcharge.targetDiscount / 100);
    }

    const totals = {
        transportationCharge: 0,
        currentNetCharge: 0,
        currentDiscount: 0,
        projectedNetCharge: 0,
        projectedDiscount: 0,
    }

    for (const charge of Object.values(charges)) {
        totals.transportationCharge += charge.currentTotalCharge;
        totals.currentNetCharge += (charge.currentTotalCharge + charge.currentDiscount);
        totals.currentDiscount += charge.currentDiscount;
        totals.projectedNetCharge += (charge.currentTotalCharge + charge.projectedDiscount);
        totals.projectedDiscount += charge.projectedDiscount;
    }

    totals.transportationCharge += surcharges.currentTotalCharge;
    totals.currentNetCharge += surcharges.currentTotalCharge + surcharges.currentDiscount;
    totals.currentDiscount += surcharges.currentDiscount;
    totals.projectedNetCharge += surcharges.currentTotalCharge + surcharges.projectedDiscount;
    totals.projectedDiscount += surcharges.projectedDiscount;

    const doc = new PDFPrinter({
        Raleway: {
            normal: 'fonts/Raleway/Raleway Regular.ttf',
            bold: 'fonts/Raleway/Raleway Bold.ttf',
        }
    });

    const formatMoney = (money: number) => {
        return money.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    };

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
                        ...Object.values(charges).map(t => [
                            t.class,
                            { text: '$' + formatMoney(t.currentTotalCharge), style: 'moneyCell' },
                            { text: '$' + formatMoney(t.currentTotalCharge / benchmark.annualizationFactor), style: 'moneyCell' },
                            '',
                        ]),
                        [
                            'Fees and Surcharges',
                            { text: '$' + formatMoney(surcharges.currentTotalCharge), style: 'moneyCell' },
                            { text: '$' + formatMoney(surcharges.currentTotalCharge / benchmark.annualizationFactor), style: 'moneyCell' },
                            '',
                        ],
                        [
                            { text: 'Total', style: 'tableTotal' },
                            { text: '$' + formatMoney(totals.transportationCharge), style: ['moneyCell', 'tableTotal']},
                            { text: '$' + formatMoney(totals.transportationCharge / benchmark.annualizationFactor), style: ['moneyCell', 'tableTotal'] },
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
                        ...Object.values(charges).map(t => [
                            t.class,
                            { text: '$' + formatMoney(t.currentDiscount + t.currentTotalCharge), style: 'moneyCell' },
                            { text: '$' + formatMoney((t.currentDiscount + t.currentTotalCharge) / benchmark.annualizationFactor), style: 'moneyCell' },
                            { text: (-1 * t.currentDiscount / t.currentTotalCharge * 100).toFixed(1) + '%', style: 'discountCell' },
                        ]),
                        [
                            'Fees and Surcharges',
                            { text: '$' + formatMoney(surcharges.currentDiscount + surcharges.currentTotalCharge), style: 'moneyCell' },
                            { text: '$' + formatMoney((surcharges.currentDiscount + surcharges.currentTotalCharge) / benchmark.annualizationFactor), style: 'moneyCell' },
                            { text: (-1 * surcharges.currentDiscount / surcharges.currentTotalCharge * 100).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            { text: 'Subtotal', style: 'tableTotal' },
                            { text: '$' + formatMoney(totals.currentNetCharge), style: ['moneyCell', 'tableTotal'] },
                            { text: '$' + formatMoney(totals.currentNetCharge / benchmark.annualizationFactor), style: ['moneyCell', 'tableTotal'] },
                            { text: (-1 * totals.currentDiscount / totals.currentNetCharge * 100).toFixed(1) + '%', style: ['discountCell', 'tableTotal'] },
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
                        ...Object.values(charges).map(t => [
                            t.class,
                            '',
                            { text: '$' + formatMoney((t.projectedDiscount + t.currentTotalCharge) / benchmark.annualizationFactor), style: 'moneyCell' },
                            { text: (-1 * t.projectedDiscount / t.currentTotalCharge * 100).toFixed(1) + '%', style: 'discountCell' },
                        ]),
                        [
                            'Fees and Surcharges',
                            '',
                            { text: '$' + formatMoney((surcharges.projectedDiscount + surcharges.currentTotalCharge) / benchmark.annualizationFactor), style: 'moneyCell' },
                            { text: (-1 * surcharges.projectedDiscount / surcharges.currentTotalCharge * 100).toFixed(1) + '%', style: 'discountCell' },
                        ],
                        [
                            { text: 'Total', style: 'tableTotal' },
                            '',
                            { text: '$' + formatMoney(totals.projectedNetCharge / benchmark.annualizationFactor), style: ['moneyCell', 'tableTotal'] },
                            { text: (-1 * totals.projectedDiscount / totals.projectedNetCharge * 100).toFixed(1) + '%', style: ['discountCell', 'tableTotal'] },
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
                            { text: '$' + formatMoney((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor), style: ['moneyCell', 'tableTotal'] },
                            { text: ((totals.currentDiscount - totals.projectedDiscount) / totals.currentNetCharge * 100).toFixed(1) + '%', style: ['discountCell', 'tableTotal'] },
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
                            { text: '$' + formatMoney((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor * 0.30), style: 'moneyCell' },
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
                                text: '$' + formatMoney(
                                    ((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor) -
                                    ((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor * 0.30)
                                ),
                                style: 'moneyCell',
                            },
                            {
                                text: ((((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor) -
                                    ((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor * 0.30)) /
                                    totals.currentNetCharge * 100).toFixed(1) + '%',
                                style: 'discountCell',
                            },
                        ],
                        [
                            'Net Savings (Year 2)',
                            '',
                            {
                                text: '$' + formatMoney(
                                    ((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor) -
                                    ((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor * 0.30)
                                ),
                                style: 'moneyCell',
                            },
                            {
                                text: ((((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor) -
                                    ((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor * 0.30)) /
                                    totals.currentNetCharge * 100).toFixed(1) + '%',
                                style: 'discountCell',
                            },
                        ],
                        [
                            'Net Savings (Year 3)',
                            '',
                            {
                                text: '$' + formatMoney(
                                    ((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor) -
                                    ((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor * 0.30)
                                ),
                                style: 'moneyCell',
                            },
                            {
                                text: ((((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor) -
                                    ((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor * 0.30)) /
                                    totals.currentNetCharge * 100).toFixed(1) + '%',
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
                                text: '$' + formatMoney((((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor) -
                                    ((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor * 0.30)) *
                                    3),
                                    style: ['moneyCell', 'tableHeader', 'summaryCell'],
                            },
                            {
                                text: ((((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor) -
                                    ((totals.currentDiscount - totals.projectedDiscount) / benchmark.annualizationFactor * 0.30)) /
                                    totals.currentNetCharge * 100).toFixed(1) + '%',
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
