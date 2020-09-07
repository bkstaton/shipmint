import React from 'react';
import { Text, useFieldState } from 'informed';

const TextField = (props: any) => {
    const { touched, error } = useFieldState(props.field);

    return (
        <div className="field">
            <label className="label">{props.label}</label>
            <div className="control">
                <Text
                    initialValue={props.initialValue}
                    className={`input ${touched ? (error ? 'is-danger' : 'is-success') : ''}`}
                    field={props.field}
                    validate={props.validate}
                    validateOnMount
                    validateOnChange
                    validateOnBlur
                />
            </div>
            { touched && error ? <p className="help">{error}</p> : null }
        </div>
    );
};

export default TextField;
