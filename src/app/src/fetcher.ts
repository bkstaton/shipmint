const fetcher = (input: RequestInfo, init?: RequestInit) => {
    return fetch(input, init).then(r => r.json());
};

export default fetcher;