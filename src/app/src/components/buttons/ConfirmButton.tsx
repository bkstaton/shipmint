import React, { PropsWithChildren } from 'react';

interface Props {
    prompt: string;
    onClick: () => void;
}

const ConfirmButton = (props: PropsWithChildren<Props>) => {
    const onClick = () => {
        if (window.confirm(props.prompt)) {
            props.onClick();
        }
    }

    return (
        <button
            type="button"
            className="button is-danger"
            onClick={onClick}
        >
            {props.children}
        </button>
    );
};

export default ConfirmButton;