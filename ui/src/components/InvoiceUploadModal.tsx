import React, { useRef, useState } from 'react';
import fetcher from '../fetcher';
import { useHistory } from 'react-router-dom';

interface Props {
    customerId: string;
    isActive: boolean;
    onClose: () => void;
}

const InvoiceUploadModal = ({ customerId, isActive, onClose }: Props) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const uploadFile = async () => {
        setLoading(true);

        if (!fileRef.current || !fileRef.current.files) {
            return;
        }

        let formData = new FormData();
        formData.append('report', fileRef.current.files[0]);

        try {
            await fetcher(
                `/api/customers/${customerId}/shipments`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
        }
        catch (e) {
            window.alert('Error parsing the invoice upload. ' + e.message);
        }

        setLoading(false);

        onClose();
    };

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <div className="box">
                    <form onSubmit={(e) => { e.preventDefault(); uploadFile(); }}>
                        <div className="field">
                            <label className="label">CSV</label>
                            <div className="control">
                                <input className="input" ref={fileRef} type="file" />
                            </div>
                        </div>
                        <button className={`button ${loading ? 'is-loading' : ''}`}>Upload</button>
                    </form>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
        </div>
    );
};

export default InvoiceUploadModal;
