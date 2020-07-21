import React from 'react';

const formatPercentage = (value: number): React.ReactNode => {
    const percentage = value * 100;

    return (
        <span className="percent">
            {percentage.toFixed(2)}
        </span>
    );
};

const formatDollar = (value: number): React.ReactNode => {
    return (
        <span className="dollar">
            {value.toFixed(2)}
        </span>
    );
}

export {
    formatPercentage,
    formatDollar,
};
