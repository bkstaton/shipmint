const fetcher = (url: RequestInfo) => {
    return fetch(url).then(r => r.json());
};

export default fetcher;