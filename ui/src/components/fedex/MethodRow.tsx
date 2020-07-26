import React, { useState } from 'react';
import MethodModal from './MethodModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTimes, faCopy, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
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
    class: string;
    order: number | null;
    buckets: Bucket[];
}

interface Props {
    method: Method;
    classes: string[];
    editMethod: (method: Method) => void;
    copyMethod: (method: Method) => void;
    removeMethod: (method: Method) => void;
    moveUp: (method: Method) => void;
    moveDown: (method: Method) => void;
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
                classes={props.classes}
            />

            <tr>
                <td>
                    <button className="button is-link" onClick={() => props.moveUp(props.method)}><FontAwesomeIcon icon={faArrowUp} /></button>
                    <button className="button is-link" onClick={() => props.moveDown(props.method)}><FontAwesomeIcon icon={faArrowDown} /></button>
                </td>
                <td>{props.method.displayName}</td>
                <td>{props.method.serviceType}</td>
                <td>{props.method.groundService}</td>
                <td>{props.method.class}</td>
                <td><button className="button is-primary" onClick={() => setModalActive(true)}><FontAwesomeIcon icon={faPen} /></button></td>
                <td><button className="button is-secondary" onClick={() => props.copyMethod(props.method)}><FontAwesomeIcon icon={faCopy} /></button></td>
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
