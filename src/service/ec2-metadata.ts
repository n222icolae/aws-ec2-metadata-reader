import axios from 'axios';

const ONE_HOUR_IN_SECONDS = 3600;
const METADATA_URL = 'http://169.254.169.254/';
const METADATA_URL_LATEST = `${METADATA_URL}latest/meta-data/`;

async function getAuthToken(): Promise<string> {
    const response = await axios.put(
        `${METADATA_URL}latest/api/token`,
        '',
        {
            headers: {
                'X-aws-ec2-metadata-token-ttl-seconds': ONE_HOUR_IN_SECONDS
            }
        }
    );
    return response.data;
}

async function fetchMetadataValue(path: string, authToken: string): Promise<any | null> {
    try {
        const response = await axios.get(`${METADATA_URL_LATEST}${path}`, {
            headers: { 'X-aws-ec2-metadata-token': authToken },
            responseType: 'text',
        });
        const data = response.data.trim();

        try {
            return JSON.parse(data);
        } catch {
            return data === '' ? null : data;
        }
    } catch (error) {
        return null;
    }
}

async function fetchMetadataKeys(basePath: string = '', authToken: string): Promise<string[]> {
    const response = await axios.get(
        `${METADATA_URL_LATEST}${basePath}`,
        {
            headers: { 'X-aws-ec2-metadata-token': authToken },
            responseType: 'text'
        }
    );

    return response.data.split('\n').filter((value: string) => value.trim() !== '');
}

async function fetchMetadata(basePath: string = '', authToken: string): Promise<any> {
    const metadataKeys = await fetchMetadataKeys(basePath, authToken);

    const processedMetadataKeys: any = {};
    for (const metadataKey of metadataKeys) {
        const fullPath = basePath + metadataKey;

        if (metadataKey.endsWith('/')) {
            const nestedMetadataKey = metadataKey.replace('/', '');
            processedMetadataKeys[nestedMetadataKey] = await fetchMetadata(fullPath, authToken);
        } else {
            processedMetadataKeys[metadataKey] = await fetchMetadataValue(fullPath, authToken);
        }
    }
    return processedMetadataKeys;
}

async function getMetadata(dataKey?: string): Promise<any> {
    const token = await getAuthToken();
    if (dataKey) {
        return await fetchMetadataValue(dataKey, token);
    } else {
        return await fetchMetadata('', token);
    }
}

export { getMetadata };
