import React, { PropsWithChildren } from 'react';

interface Props {
    prompt: string;
    onClick: () => void;
}

const ConfirmButton = (props: PropsWithChildren<Props>) => {
    const onClick = (e: React.MouseEvent) => {
        if (window.confirm(props.prompt)) {
            props.onClick();
        }

        e.stopPropagation();
        e.preventDefault();
        return false;
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