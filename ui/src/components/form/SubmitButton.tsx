import React, { PropsWithChildren } from 'react';
import { useFormState } from 'informed';

interface Props {

}

const SubmitButton = (props: PropsWithChildren<Props>) => {
    const { invalid } = useFormState();

    return (
        <button
            type="submit"
            disabled={invalid}
            className="button is-primary"
        >
            {props.children}
        </button>
    );
};

export default SubmitButton;
