import React, { useState } from 'react';
import fetcher from '../fetcher';

interface Surcharge {
    type: string;
    charge: number | null;
}

interface Props {
    isActive: boolean;
    surcharge: Surcharge;
    onClose: () => void;
}

const SurchargeModal = (props: Props) => {
    const [surcharge, setSurcharge] = useState(props.surcharge);

    const savePublishedCharge = (type: string, charge: number | null) => {
        fetcher(
            `/api/fedex-surcharges`,
            {
                method: 'PUT',
                headers: [
                    ['Content-Type', 'application/json'],
                ],
                body: JSON.stringify({
                    type,
                    charge,
                }),
            }
        ).then(props.onClose);
    };

    return (
        <div className={`modal ${props.isActive ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={props.onClose}></div>
            <div className="modal-content">
                <div className="box">
                    <form onSubmit={(e) => { e.preventDefault(); savePublishedCharge(surcharge.type, surcharge.charge); }}>
                        <div className="field">
                            <label className="label">Type</label>
                            <div className="control">
                                <input className="input" readOnly value={surcharge.type} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">CSV</label>
                            <div className="control">
                                <input
                                    className="input"
                                    value={surcharge.charge !== null ? surcharge.charge : undefined}
                                    onChange={(e) => setSurcharge({
                                        ...surcharge,
                                        charge: e.target.value.length ? parseFloat(e.target.value) : null
                                    })}
                                />
                            </div>
                        </div>
                        <button type="submit" className={`button`}>Save</button>
                    </form>
                </div>
            </div>
            <button className="modal-close" aria-label="close" onClick={props.onClose} />
        </div>
    );
};

export default SurchargeModal;
