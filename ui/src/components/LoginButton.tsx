import React from 'react';

interface Props {
    icon: string;
    alt: string;
    href: string;
    text: string;
}

const LoginButton = (props: Props) => (
    <div className="columns is-vcentered">
        <div className="box column is-one-fifth is-offset-two-fifths">
            <a href={props.href}>
                <div className="columns is-vcentered">
                    <div className="column is-3">
                        <img className="image is-inline is-64x64" src={props.icon} alt={props.alt} />
                    </div>
                    <div className="column is-9">
                        <span className="is-size-4">
                            {props.text}
                        </span>
                    </div>
                </div>
            </a>
        </div>
    </div>
);

export default LoginButton;
