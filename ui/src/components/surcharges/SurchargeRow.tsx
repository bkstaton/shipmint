import React, { useEffect, useState } from 'react';
import { formatDollar } from '../../utility/format';
import SurchargeModal from '../SurchargeModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faExclamation } from '@fortawesome/free-solid-svg-icons';

interface SummarySurcharge {
    type: string;
    count: number;
    known: boolean;
    static: boolean;
    totalCharge: number;
    publishedCharge: number;
    actualDiscount: number;
    targetDiscount: number;
}

interface Props {
    surcharge: SummarySurcharge;
    saveSurchargeDiscount: (type: string, currentDiscount: number | null, targetDiscount: number | null) => void;
}

const SurchargeRow = ({ surcharge, saveSurchargeDiscount }: Props) => {
    const [modalActive, setModalActive] = useState(false);

    const [currentDiscount, setCurrentDiscount] = useState(surcharge.actualDiscount);
    const [targetDiscount, setTargetDiscount] = useState(surcharge.targetDiscount);

    const[proposedNetSpend, setProposedNetSpend] = useState(surcharge.publishedCharge * surcharge.count - (surcharge.targetDiscount / 100) * surcharge.publishedCharge * surcharge.count);

    useEffect(() => {
        setCurrentDiscount(surcharge.actualDiscount);
        setTargetDiscount(surcharge.targetDiscount);
        setProposedNetSpend(surcharge.publishedCharge * surcharge.count - (surcharge.targetDiscount / 100) * surcharge.publishedCharge * surcharge.count);
    }, [surcharge]);

    return (
        <tr>
            <td>{surcharge.type}</td>
            <td>{surcharge.count}</td>
            <td>
                {formatDollar(surcharge.publishedCharge)}
                <button type="button" className="button is-text is-small" onClick={() => setModalActive(true)}>
                    <span className="icon">
                        {surcharge.known ? (
                            <FontAwesomeIcon icon={faEdit} />
                        ) : (
                            <FontAwesomeIcon icon={faExclamation} />
                        )}
                    </span>
                </button>
                <SurchargeModal
                    isActive={modalActive}
                    surcharge={{type: surcharge.type, charge: surcharge.publishedCharge}}
                    onClose={() => setModalActive(false)}
                />
            </td>
            <td>{formatDollar(surcharge.count * surcharge.publishedCharge)}</td>
            <td>{formatDollar(surcharge.totalCharge)}</td>
            <td>{formatDollar(surcharge.count * surcharge.publishedCharge - surcharge.totalCharge)}</td>
            <td>
                <input
                    className="input"
                    type="number"
                    min={0}
                    step={0.01}
                    value={currentDiscount !== undefined ? currentDiscount : ''}
                    onChange={e => setCurrentDiscount(parseFloat(e.target.value))}
                    onBlur={() => saveSurchargeDiscount(surcharge.type, currentDiscount || 0, targetDiscount || 0)}
                />
            </td>
            <td>
                <input
                    className="input"
                    type="number"
                    min={0}
                    step={0.01}
                    value={targetDiscount !== undefined ? targetDiscount : ''}
                    onChange={e => setTargetDiscount(parseFloat(e.target.value))}
                    onBlur={() => saveSurchargeDiscount(surcharge.type, currentDiscount || 0, targetDiscount || 0)}
                />
            </td>
            <td>{formatDollar(proposedNetSpend)}</td>
            <td>{formatDollar(surcharge.totalCharge - proposedNetSpend)}</td>
        </tr>
    );
};

export default SurchargeRow;
