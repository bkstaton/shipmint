import React, { useState, ChangeEvent, ReactElement, useRef } from 'react';
import DiscountPercentTable from './benchmark/DiscountPercentTable';
import TotalsTable from './benchmark/TotalsTable';
import AnnualizationTable from './benchmark/AnnualizationTable';
import { RouteComponentProps } from 'react-router-dom';
import fetcher from '../fetcher';

enum Tabs {
    DiscountPercent,
    Totals,
    Annualization,
}

const Benchmark = (props: RouteComponentProps<{ customerId: string, benchmarkId: string }>) => {
    const [tab, setTab] = useState(Tabs.DiscountPercent);
    const [benchmarks, setBenchmarks] = useState(null as any);

    const fileRef = useRef<HTMLInputElement>(null);

    const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (!fileRef.current || !fileRef.current.files) {
            return;
        }

        let formData = new FormData();
        formData.append('report', fileRef.current.files[0]);

        fetcher(
            `/api/customers/${props.match.params.customerId}/benchmarks`,
            {
                method: 'POST',
                body: formData,
            }
        ).then((data) => {
            setBenchmarks(data.benchmarks);
        });
    };

    let tabComponent: ReactElement | null = null;
    switch (tab) {
        case Tabs.DiscountPercent:
            tabComponent = <DiscountPercentTable benchmarks={benchmarks} />;
            break;
        case Tabs.Totals:
            tabComponent = <TotalsTable benchmarks={benchmarks} />;
            break;
        case Tabs.Annualization:
            tabComponent = <AnnualizationTable benchmarks={benchmarks} />;
            break;
    }

    return (
        <section className="section">
            <h1 className="title">Benchmark</h1>
            <div className="field">
                <label className="label">Upload File</label>
                <div className="control">
                    <input className="input" type="file" ref={fileRef} onChange={uploadFile} />
                </div>
            </div>

            <div className="tabs">
                <ul>
                    <li
                        className={tab === Tabs.DiscountPercent ? 'is-active' : ''}
                        onClick={() => setTab(Tabs.DiscountPercent)}
                    >
                        Discount %
                    </li>
                    <li
                        className={tab === Tabs.Totals ? 'is-active' : ''}
                        onClick={() => setTab(Tabs.Totals)}
                    >
                        Totals
                    </li>
                    <li
                        className={tab === Tabs.Annualization ? 'is-active' : ''}
                        onClick={() => setTab(Tabs.Annualization)}
                    >
                        Annualization
                    </li>
                </ul>
            </div>

            <div className="container">
                {tabComponent || null}
            </div>
        </section>
    );
};

export default Benchmark;
