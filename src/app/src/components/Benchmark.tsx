import React, { useState, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import DiscountTable from './benchmark/DiscountTable';
import TotalsTable from './benchmark/TotalsTable';
import AnnualizationTable from './benchmark/AnnualizationTable';
import fetcher from '../fetcher';

enum Tabs {
    Discount,
    Annualization,
}

const Benchmark = (props: RouteComponentProps<{ customerId: string, benchmarkId: string }>) => {
    const [tab, setTab] = useState(Tabs.Discount);

    const { data: benchmark, isValidating } = useSWR(`/api/customers/${props.match.params.customerId}/benchmarks/${props.match.params.benchmarkId}`, fetcher);

    return (
        <section className="section">
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
