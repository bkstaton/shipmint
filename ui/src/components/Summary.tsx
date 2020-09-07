import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faHandHoldingUsd, faFunnelDollar, faQuestionCircle, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../fetcher';
import SummaryTile from './summary/SummaryTile';
import SummaryBox from './summary/SummaryBox';

const Summary = () => {
  const params = useParams<{customerId: string}>();

  const customerId = params.customerId;

  const { data: summary, isValidating } = useSWR(`/api/customers/${customerId}/summary`, fetcher, { revalidateOnFocus: false });

  let maxVolume: number;
  let maxSpend: number;

  if (summary) {
    maxVolume = Math.max(...summary.transportationCharges.map((charge: any) => {
      return charge.count;
    }));
    maxSpend = Math.max(...summary.transportationCharges.map((charge: any) => {
      return charge.netCharge.sample;
    }));
  }

  return (
    isValidating || !summary ? (
      <div className="pageloader is-bottom-to-top"></div>
    ) : (
        <div>
          <div className="columns is-left">
            <div className="column">
              <h1 className="title">
                <span>Summary</span>
                <span className="icon is-medium is-size-3 ml-2">
                  <a href={`/api/customers/${customerId}/benchmark/export`} target="_blank">
                    <FontAwesomeIcon icon={faFilePdf} />
                  </a>
                </span>
              </h1>
            </div>
            <div className="column is-narrow">
              <div className="box has-text-centered">
                <div className="content">
                  <span>OVERALL RATING</span>
                  <span className="icon has-text-primary has-tooltip-arrow" data-tooltip="Tooltip Text">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </span>
                  <strong><span className="subtitle has-text-danger">D+</span></strong>
                </div>
              </div>
            </div>
          </div>

          <div className="tile is-ancestor has-text-centered" >
            <SummaryTile
              icon={faFileContract}
              title="VOLUME"
              value={summary.count || '0'}
            />
            <SummaryTile
              icon={faFunnelDollar}
              title="NET SPEND"
              value={`$${summary.netTotal.sample ? summary.netTotal.sample.toFixed(2) : '0'}`}
            />
            <SummaryTile
              icon={faHandHoldingUsd}
              title="DISCOUNTS"
              value={`${summary.netTotal.discount ? summary.netTotal.discount.toFixed(1) : '0'}%`}
            />
          </div>

          <div className="box ">
            <div className="columns">
              <div className="column is-6">
                <p className="subtitle">SHIPMINTS</p>
                <p className="title">PROJECTED SAVINGS</p>
              </div>
              <div className="column has-text-centered is-2">
                <p className="subtitle">PERCENT SAVED</p>
                <p className="title has-text-success">
                  {summary.projectedTotal.discount ? summary.projectedTotal.discount.toFixed(1) : '0'}%
                </p>
              </div>
              <div className="column has-text-centered is-2">
                <p className="subtitle">MONEY SAVED</p>
                <p className="title has-text-success">
                  ${((summary.grossTotal.sample || 0) - (summary.projectedTotal.sample || 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="box">
            {summary.transportationCharges.map((charge: any) => (
              <SummaryBox charge={charge} maxVolume={maxVolume} maxSpend={maxSpend} />
            )).flatMap((e: any) => ([
              <hr></hr>, e
            ])).slice(1)
            }
          </div>
        </div>
      )
  );
};

export default Summary;