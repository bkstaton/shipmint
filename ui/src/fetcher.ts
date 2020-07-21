const fetcher = async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init);

    const json = await response.json();

    if (response.status < 200 || response.status > 299) {
        throw new Error(json.error);
    }

    return json;
};

export default fetcher;