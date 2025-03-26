import axios from 'axios';

const METADATA_BASE_URL = 'http://169.254.169.254/latest/meta-data/';

async function getAuthToken(): Promise<string> {
    const response = await axios.put(
        'http://169.254.169.254/latest/api/token',
        '',
        {
            headers: {
                'X-aws-ec2-metadata-token-ttl-seconds': '21600'
            }
        }
    );
    return response.data;
}

async function fetchMetadataValue(token: string, path: string): Promise<any | null> {
    try {
        const response = await axios.get(`${METADATA_BASE_URL}${path}`, {
            headers: { 'X-aws-ec2-metadata-token': token },
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

async function fetchMetadataRoutes(token: string, basePath: string = ''): Promise<any> {
    const response = await axios.get(
        `${METADATA_BASE_URL}${basePath}`,
        {
            headers: {
                'X-aws-ec2-metadata-token': token
            },
            responseType: 'text'
        }
    );

    const routes = response.data.split('\n').filter((route: string) => route.trim() !== '');

    const processedRoutes: any = {};
    for (const route of routes) {
        const fullPath = basePath + route;

        if (route.endsWith('/')) {
            const nestedRouteKey = route.replace('/', '');
            processedRoutes[nestedRouteKey] = await fetchMetadataRoutes(token, fullPath);
        } else {
            const value = await fetchMetadataValue(token, fullPath);
            processedRoutes[route] = value;
        }
    }
    return processedRoutes;
}

async function generateMetadataJson() {
    const token = await getAuthToken();
    return await fetchMetadataRoutes(token);
}

if (require.main === module) {
    generateMetadataJson();
}

export { generateMetadataJson, fetchMetadataRoutes };
