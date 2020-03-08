import React, { useState, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import DiscountTable from './benchmark/DiscountTable';
import AnnualizationTable from './benchmark/AnnualizationTable';
import fetcher from '../fetcher';
import Breadcrumb from './Breadcrumb';

enum Tabs {
    Discount,
    Annualization,
}

const Benchmark = (props: RouteComponentProps<{ customerId: string, benchmarkId: string }>) => {
    const [tab, setTab] = useState(Tabs.Discount);

    const { data: benchmark, isValidating } = useSWR(`/api/customers/${props.match.params.customerId}/benchmarks/${props.match.params.benchmarkId}`, fetcher);

    const breadcrumbs = [
        { path: '/customers', name: 'Customers' },
        { path: `/customers/${props.match.params.customerId}`, name: props.match.params.customerId },
        { path: `/customers/${props.match.params.customerId}`, name: 'Benchmarks' },
        { path: `/customers/${props.match.params.customerId}/benchmarks/${props.match.params.benchmarkId}`, name: props.match.params.benchmarkId },
    ];

    return (
        <section className="section">
            <Breadcrumb breadcrumbs={breadcrumbs} />
            <h1 className="title">Benchmark</h1>
            <div className="tabs">
                <ul>
                    <li
                        className={tab === Tabs.Discount ? 'is-active' : ''}
                        onClick={() => setTab(Tabs.Discount)}
                    >
                        <a>Discounts</a>
                    </li>
                    <li
                        className={tab === Tabs.Annualization ? 'is-active' : ''}
                        onClick={() => setTab(Tabs.Annualization)}
                    >
                        <a>Annualization</a>
                    </li>
                </ul>
            </div>
            {isValidating
                ? <FontAwesomeIcon icon={faSpinner} />
                : <>
                    <div className={tab === Tabs.Discount ? '' : 'is-hidden'}><DiscountTable benchmark={benchmark} /></div>
                    <div className={tab === Tabs.Annualization ? '' : 'is-hidden'}><AnnualizationTable benchmark={benchmark} /></div>
                </>
            }
        </section>
    );
};

export default Benchmark;
