import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

interface Bucket {
    displayName: string;
    minimum: number | null;
    maximum: number | null;
}

interface Method {
    id?: number;
    displayName: string;
    serviceType: string;
    groundService: string;
    order: number | null;
    buckets: Bucket[];
}

interface Props {
    isActive: boolean;
    method?: Method;
    upsertMethod: (method: Method) => void;
    onClose: () => void;
}

const MethodModal = (props: Props) => {
    const [method, setMethod] = useState(props.method || {
        displayName: '',
        serviceType: '',
        groundService: '',
        order: null,
        buckets: [] as Bucket[],
    });

    const [newBucket, setNewBucket] = useState({
        displayName: '',
    } as Bucket);

    useEffect(() => {
        setMethod(props.method || {
            displayName: '',
            serviceType: '',
            groundService: '',
            order: null,
            buckets: [],
        });
    }, [props.method, props.isActive]);

    const addBucket = (bucket: Bucket) => {
        for (const b of method.buckets) {
            if (b.displayName === bucket.displayName) {
                window.alert('Cannot add duplicate bucket');
                return;
            }
        }

        setMethod({
            ...method,
            buckets: [...method.buckets, bucket],
        });

        setNewBucket({
            displayName: '',
            minimum: null,
            maximum: null,
        });
    };

    const updateBucket = (bucketName: string, bucket: Bucket) => {
        setMethod({
            ...method,
            buckets: [
                ...method.buckets.filter(b => b.displayName !== bucketName),
                bucket,
            ],
        });
    };

    const removeBucket = (name: string) => {
        setMethod({
            ...method,
            buckets: method.buckets.filter(b => b.displayName !== name),
        });
    };

    return (
        <div className={`modal ${props.isActive ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={props.onClose}></div>
            <div className="modal-content">
                <div className="box">
                    <form>
                        <div className="field">
                            <label className="label">Display Name</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Display name in report"
                                    value={method.displayName}
                                    onChange={e => setMethod({
                                        ...method,
                                        displayName: e.target.value,
                                    })}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Service Type</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Name used in Service Type column"
                                    value={method.serviceType}
                                    onChange={e => setMethod({
                                        ...method,
                                        serviceType: e.target.value,
                                    })}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Ground Service</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Name used in Ground Service column"
                                    value={method.groundService}
                                    onChange={e => setMethod({
                                        ...method,
                                        groundService: e.target.value,
                                    })}
                                />
                            </div>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <td>Name</td>
                                    <td>Minimum</td>
                                    <td>Maximum</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {method && method.buckets && method.buckets.sort((a: Bucket, b: Bucket) => {
                                    if (a.minimum === null) {
                                        return -1;
                                    }
                                    if (b.minimum === null) {
                                        return 1;
                                    }
                                    return a.minimum - b.minimum;
                                }).map((b: Bucket) => (
                                    <tr>
                                        <td>
                                            <input
                                                className="input"
                                                type="text"
                                                value={b.displayName}
                                                onChange={e => updateBucket(b.displayName, {
                                                    displayName: e.target.value,
                                                    minimum: b.minimum,
                                                    maximum: b.maximum,
                                                })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="input"
                                                type="number"
                                                step={0.01}
                                                value={b.minimum ? b.minimum : ''}
                                                onChange={e => updateBucket(b.displayName, {
                                                    displayName: b.displayName,
                                                    minimum: parseFloat(e.target.value),
                                                    maximum: b.maximum,
                                                })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="input"
                                                type="number"
                                                step={0.01}
                                                value={b.maximum ? b.maximum : ''}
                                                onChange={e => updateBucket(b.displayName, {
                                                    displayName: b.displayName,
                                                    minimum: b.minimum,
                                                    maximum: parseFloat(e.target.value),
                                                })}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="button is-danger"
                                                onClick={() => removeBucket(b.displayName)}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">New Bucket</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <p className="control is-expanded">
                                        <input
                                            className="input"
                                            type="text"
                                            placeholder="Name"
                                            value={newBucket.displayName}
                                            onChange={(e) => setNewBucket({ ...newBucket, displayName: e.target.value })}
                                        />
                                    </p>
                                </div>
                                <div className="field">
                                    <p className="control is-expanded">
                                        <input
                                            className="input"
                                            type="number"
                                            step={0.01}
                                            placeholder="Minimum"
                                            value={newBucket.minimum || ''}
                                            onChange={(e) => setNewBucket({ ...newBucket, minimum: e.target.value ? parseFloat(e.target.value) : null })}
                                        />
                                    </p>
                                </div>
                                <div className="field">
                                    <p className="control is-expanded">
                                        <input
                                            className="input"
                                            type="number"
                                            step={0.01}
                                            placeholder="Maximum"
                                            value={newBucket.maximum || ''}
                                            onChange={(e) => setNewBucket({ ...newBucket, maximum: e.target.value ? parseFloat(e.target.value) : null })}
                                        />
                                    </p>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <button type="button" className="button is-link" onClick={() => addBucket(newBucket)}><FontAwesomeIcon icon={faPlus} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-primary" onClick={(e) => { props.upsertMethod(method); props.onClose(); e.preventDefault(); }}>Save</button>
                            </div>
                            <div className="control">
                                <button type="button" className="button is-secondary" onClick={() => props.onClose()}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <button className="modal-close is-large" onClick={props.onClose} aria-label="close"></button>
        </div>
    );
};

export default MethodModal;
