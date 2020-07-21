import React from 'react';

interface BreadcrumbLink {
    path: string;
    name: string;
}

interface Props {
    breadcrumbs: BreadcrumbLink[];
}

const Breadcrumb = (props: Props) => {
    return (
        <nav className="breadcrumb">
            <ul>
                {props.breadcrumbs.map(b => <li><a href={b.path}>{b.name}</a></li>)}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
