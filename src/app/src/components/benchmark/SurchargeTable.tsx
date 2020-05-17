import React from 'react';
import SurchargeTab from './SurchargeTab';
import SurchargeRow from './SurchargeRow';

interface Props {
    surcharges?: any[];
}

const SurchargeTable = (props: Props) => (
    <div className="table-container">
        <table className="table is-striped is-hoverable">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Count</th>
                    <th>Published Charge</th>
                    <th>Total Published Charge</th>
                    <th>Total Net Charge</th>
                    <th>Discount ($)</th>
                    <th>Discount (%)</th>
                </tr>
            </thead>
            <tbody>
                {props.surcharges && props.surcharges.length && props.surcharges.sort((a: any, b: any) => a.type < b.type ? -1 : 1).map((surcharge: any) => (
                    <SurchargeRow surcharge={surcharge} />
                ))}
            </tbody>
        </table>
    </div>
);

export default SurchargeTable;
