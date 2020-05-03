import React, { useState } from 'react';
import MethodModal from './MethodModal';
import MethodRow from './MethodRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import fetcher from '../../fetcher';

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
    buckets: Bucket[];
}

const MethodManager = () => {
    const [modalActive, setModalActive] = useState(false);

    const { data: methods, isValidating, mutate } = useSWR<Method[]>('/api/fedex-shipping-methods', fetcher);
    
    const addMethod = (method: Method) => {
        if (!methods) {
            return;
        }

        for (let m of methods) {
            if (m.displayName === method.displayName || m.serviceType === method.serviceType) {
                window.alert('Cannot add duplicate method.');
                return;
            }
        }

        fetcher(
            `/api/fedex-shipping-methods`,
            {
                method: 'POST',
                headers: [
                    ['Content-Type', 'application/json'],
                ],
                body: JSON.stringify(method),
            }
        ).then(() => {
            mutate([
                ...methods,
                method
            ], false);
        });
    };

    const updateMethod = (method: Method) => {
        if (!methods) {
            return;
        }

        fetcher(
            `/api/fedex-shipping-methods/${method.id}`,
            {
                method: 'PATCH',
                headers: [
                    ['Content-Type', 'application/json'],
                ],
                body: JSON.stringify(method),
            }
        ).then(() => {
            mutate([
                ...(methods.filter((m: any) => m.displayName !== method.displayName)),
                method
            ], false);
        });
    };

    const removeMethod = (method: Method) => {
        if (!methods) {
            return;
        }

        fetcher(`/api/fedex-shipping-methods/${method.id}`, { method: 'DELETE' }).then(() => {
            mutate([
                ...(methods.filter((m: any) => m.id !== method.id)),
            ], false);
        });
    };

    return (
        <div>
            <MethodModal
                isActive={modalActive}
                onClose={() => setModalActive(false)}
                upsertMethod={addMethod}
            />

            <h1 className="title">Methods</h1>
            <table className="table">
                <thead>
                    <tr>
                        <td>Display Name</td>
                        <td>Service Type</td>
                        <td>Ground Service</td>
                        <td></td>
                        <td>
                            <button type="button" className="button is-link" onClick={() => setModalActive(true)}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {!isValidating
                        ? methods && methods.map(m => <MethodRow method={m} editMethod={updateMethod} removeMethod={removeMethod} />)
                        : <FontAwesomeIcon icon={faSpinner} spin />}
                </tbody>
            </table>
        </div>
    );
};

export default MethodManager;
