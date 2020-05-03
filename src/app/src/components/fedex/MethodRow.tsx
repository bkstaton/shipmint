import React, { useState } from 'react';
import MethodModal from './MethodModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import ConfirmButton from '../buttons/ConfirmButton';

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

interface Props {
    method: Method;
    editMethod: (method: Method) => void;
    removeMethod: (method: Method) => void;
}

const MethodRow = (props: Props) => {
    const [modalActive, setModalActive] = useState(false);

    return (
        <>
            <MethodModal
                isActive={modalActive}
                onClose={() => setModalActive(false)}
                upsertMethod={props.editMethod}
                method={props.method}
            />

            <tr>
                <td>{props.method.displayName}</td>
                <td>{props.method.serviceType}</td>
                <td>{props.method.groundService}</td>
                <td><button className="button is-primary" onClick={() => setModalActive(true)}><FontAwesomeIcon icon={faPen} /></button></td>
                <td>
                    <ConfirmButton
                        prompt="Are you sure you want to delete this method?"
                        onClick={() => props.removeMethod(props.method)}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </ConfirmButton>
                </td>
            </tr>
        </>
    );
};

export default MethodRow;
