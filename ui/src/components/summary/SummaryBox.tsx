import React from 'react';

interface Props {
   charge: any;
   maxVolume: number;
   maxSpend: number;
}

const SummaryBox = (props: Props) =>  (
  <div className="content">
    <p>
      <strong>{props.charge.type}</strong>
      <div className="columns">
        <div className="column is-1">
        <label>SPEND</label>
        </div>
        <div className="column is-10">
          <progress className="progress is-primary" value={props.charge.netCharge.sample} max={props.maxSpend}>{}</progress>
        </div>
        <div className="column is-1">
        <label>${props.charge.netCharge.sample.toFixed(2)}</label>
        </div>
      </div>
      <div className="columns">
        <div className="column is-1">
        <label>VOLUME</label>
        </div>
        <div className="column is-10">
          <progress className="progress is-link" value={props.charge.count} max={props.maxVolume}>{props.charge.count}</progress>
        </div>
        <div className="column is-1">
        <label>{props.charge.count}</label>
        </div>
      </div>
    </p>
  </div>
);

export default SummaryBox;