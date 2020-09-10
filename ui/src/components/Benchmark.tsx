import React, { useState, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import DiscountTab from './benchmark/DiscountTab';
import fetcher from '../fetcher';
import SummaryTab from './benchmark/SummaryTab';
import Breadcrumb from './Breadcrumb';
import SurchargeTab from './benchmark/SurchargeTab';

enum Tabs {
    Summary,
    Discount,
    Surcharges,
}

const Benchmark = (props: RouteComponentProps<{ customerId: string, benchmarkId: string }>) => {
    const [tab, setTab] = useState(Tabs.Summary);

    const customerId = props.match.params.customerId;
    const benchmarkId = props.match.params.benchmarkId;

    const benchmarkEndpoint = `/api/customers/${customerId}/benchmarks/${benchmarkId}`;

    const { data: benchmark, isValidating, mutate } = useSWR(benchmarkEndpoint, fetcher, { revalidateOnFocus: false });

    const saveTargetDiscount = (totalId: number, targetDiscount: number) => {
        const newBenchmark = Object.assign({}, benchmark);

        const total = newBenchmark.totals.find((t: any) => t.id === totalId);
        total.targetDiscount = targetDiscount;

        fetcher(
            `/api/customers/${customerId}/benchmarks/${benchmarkId}/totals/${totalId}`,
            {
                method: 'PATCH',
                headers: [
                    ['Content-Type', 'application/json'],
                ],
                body: JSON.stringify({
                    targetDiscount,
                }),
            }
        ).then((data) => {
            mutate(newBenchmark, false);
        });
    };

    const savePublishedCharge = (surchargeId: number, publishedCharge: number | null, targetDiscount: number | null) => {
        const newBenchmark = Object.assign({}, benchmark);

        const surcharge = newBenchmark.surcharges.find((s: any) => s.id === surchargeId);
        surcharge.publishedCharge = publishedCharge;
        surcharge.targetDiscount = targetDiscount;

        fetcher(
            `/api/customers/${customerId}/benchmarks/${benchmarkId}/surcharges/${surchargeId}`,
            {
                method: 'PATCH',
                headers: [
                    ['Content-Type', 'application/json'],
                ],
                body: JSON.stringify({
                    publishedCharge,
                    targetDiscount,
                }),
            }
        ).then((data) => {
            mutate(newBenchmark, false);
        });
    };

    const breadcrumbs = [
        { path: '/customers', name: 'Customers' },
        { path: `/customers/${customerId}`, name: customerId },
        { path: `/customers/${customerId}`, name: 'Benchmarks' },
        { path: `/customers/${customerId}/benchmarks/${benchmarkId}`, name: benchmarkId },
    ];

    return (
        <div>
            <Breadcrumb breadcrumbs={breadcrumbs} />
            <h1 className="title">Benchmark</h1>
            <a href={`/api/customers/${customerId}/benchmarks/${benchmarkId}/file`} target="_blank"><FontAwesomeIcon icon={faDownload} /></a>
            <a href={`/api/customers/${customerId}/benchmarks/${benchmarkId}/export`} target="_blank"><FontAwesomeIcon icon={faFilePdf} /></a>
            <div className="tabs">
                <ul>
                    <li
                        className={tab === Tabs.Summary ? 'is-active' : ''}
                        onClick={() => setTab(Tabs.Summary)}
                    >
                        <a>Summary</a>
                    </li>
                    <li
                        className={tab === Tabs.Discount ? 'is-active' : ''}
                        onClick={() => setTab(Tabs.Discount)}
                    >
                        <a>Discounts</a>
                    </li>
                    <li
                        className={tab === Tabs.Surcharges ? 'is-active' : ''}
                        onClick={() => setTab(Tabs.Surcharges)}
                    >
                        <a>Surcharges</a>
                    </li>
                </ul>
            </div>
            {isValidating
                ? <FontAwesomeIcon icon={faSpinner} />
                : <>
                    <div className={tab === Tabs.Summary ? '' : 'is-hidden'}><SummaryTab benchmark={benchmark} /></div>
                    <div className={tab === Tabs.Discount ? '' : 'is-hidden'}><DiscountTab benchmark={benchmark} saveTargetDiscount={saveTargetDiscount} /></div>
                    <div className={tab === Tabs.Surcharges ? '' : 'is-hidden'}><SurchargeTab benchmark={benchmark} savePublishedCharge={savePublishedCharge} /></div>
                </>
            }
        </div>
    );
};

export default Benchmark;
