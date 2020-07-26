import React, { useState, useEffect } from 'react';
import MethodModal from './MethodModal';
import MethodRow from './MethodRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import { uniq, isEmpty } from 'lodash';
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
    class: string;
    order: number | null;
    buckets: Bucket[];
}

const MethodManager = () => {
    const [modalActive, setModalActive] = useState(false);

    const { data: methods, isValidating, mutate, revalidate } = useSWR<Method[]>('/api/fedex-shipping-methods', fetcher);
    const [ classes, setClasses ] = useState([] as string[]);

    useEffect(() => {
        setClasses(methods ? uniq(methods.map(m => m.class).filter(v => !isEmpty(v))) : []);
    }, [methods]);
    
    const addMethod = (method: Method) => {
        if (!methods) {
            return;
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
                ...(methods.filter((m: any) => m.id !== method.id)),
                method
            ], false);
        });
    };

    const removeMethod = (method: Method) => {
        if (!methods) {
            return;
        }

        fetcher(`/api/fedex-shipping-methods/${method.id}`, { method: 'DELETE' }).then(() => {
            mutate(methods.filter((m: any) => m.id !== method.id), false);
        });
    };

    const moveMethodUp = (method: Method) => {
        if (!methods) {
            return;
        }

        fetcher(`/api/fedex-shipping-methods/${method.id}/up`, { method: 'PATCH' }).then(() => {
            revalidate();
        });
    };

    const moveMethodDown = (method: Method) => {
        if (!methods) {
            return;
        }

        fetcher(`/api/fedex-shipping-methods/${method.id}/down`, { method: 'PATCH' }).then(() => {
            revalidate();
        });
    };

    return (
        <div>
            <MethodModal
                isActive={modalActive}
                onClose={() => setModalActive(false)}
                upsertMethod={addMethod}
                classes={classes}
            />

            <h1 className="title">Methods</h1>
            <table className="table">
                <thead>
                    <tr>
                        <td></td>
                        <td>Display Name</td>
                        <td>Service Type</td>
                        <td>Ground Service</td>
                        <td>Class</td>
                        <td></td>
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
                        ? methods && methods.sort((a, b) => {
                            if (a.order === null) {
                                if (b.order !== null) {
                                    return 1;
                                }
                                return 0;
                            }

                            if (b.order === null) {
                                if (a.order !== null) {
                                    return -1;
                                }
                                return 0;
                            }

                            return a.order - b.order;
                        }).map(m => (
                            <MethodRow
                                method={m}
                                classes={classes}
                                editMethod={updateMethod}
                                copyMethod={addMethod}
                                removeMethod={removeMethod}
                                moveUp={moveMethodUp}
                                moveDown={moveMethodDown}
                            />
                        ))
                        : <FontAwesomeIcon icon={faSpinner} spin />}
                </tbody>
            </table>
        </div>
    );
};

export default MethodManager;
