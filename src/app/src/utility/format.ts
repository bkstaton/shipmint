const formatPercentage = (value: number): string => {
    const percentage = value * 100;

    return percentage.toFixed(2) + ' %';
};

const formatDollar = (value: number): string => {
    return '$ ' + value.toFixed(2);
}

export {
    formatPercentage,
    formatDollar,
};
