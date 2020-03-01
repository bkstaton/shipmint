const formatPercentage = (value?: number): string => {
    if (value == undefined) {
        return '';
    }

    const percentage = value * 100;

    return percentage.toFixed(2) + ' %';
};

export { formatPercentage };
