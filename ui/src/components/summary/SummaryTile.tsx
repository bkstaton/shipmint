import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface Props {
    icon: IconDefinition;
    title: string;
    value: string;
}

const SummaryTile = (props: Props) =>  (
  <div className="tile is-parent">
    <article className="tile is-child box">
        <span className="has-text-success" >
        <FontAwesomeIcon icon={props.icon}/>
        </span>
            <p className="subtitle">{props.title}</p>
            <p className="title">
                <strong>{props.value}</strong>
            </p>
    </article>
  </div>
);

export default SummaryTile;
