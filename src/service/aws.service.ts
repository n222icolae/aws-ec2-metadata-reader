import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const METADATA_BASE_URL = 'http://169.254.169.254/latest/meta-data/';

async function generateMetadataToken(): Promise<string> {
    try {
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
    } catch (error) {
        console.error('Failed to generate metadata token:', error);
        throw error;
    }
}

async function fetchMetadataRoutes(token: string, basePath: string = ''): Promise<any> {
    try {
        const response = await axios.get(
            `${METADATA_BASE_URL}${basePath}`,
            {
                headers: {
                    'X-aws-ec2-metadata-token': token
                },
                // Ensure we get text response for metadata listing
                responseType: 'text'
            }
        );

        // Split response into lines and filter out empty lines
        const routes = response.data.split('\n').filter((route: string) => route.trim() !== '');

        // Process routes recursively
        const processedRoutes: any = {};
        for (const route of routes) {
            const fullPath = basePath + route;

            // Check if route ends with '/' (indicating it's a nested path)
            if (route.endsWith('/')) {
                // Recursively fetch nested routes
                processedRoutes[route.replace('/', '')] = await fetchMetadataRoutes(token, fullPath);
            } else {
                // For non-directory routes, just add the route name
                processedRoutes[route] = null;
            }
        }

        return processedRoutes;
    } catch (error) {
        console.error(`Failed to fetch metadata for path ${basePath}:`, error);
        throw error;
    }
}

async function generateMetadataJson() {
    try {
        // Generate metadata token
        const token = await generateMetadataToken();

        // Fetch all metadata routes
        const metadataRoutes = await fetchMetadataRoutes(token);

        // Convert to JSON with pretty printing (2-space indentation)
        const jsonContent = JSON.stringify(metadataRoutes, null, 2);

        // Write to urls.json
        const outputPath = path.join(__dirname, 'urls.json');
        fs.writeFileSync(outputPath, jsonContent);

        console.log('Metadata routes saved to urls.json');
        return metadataRoutes;
    } catch (error) {
        console.error('Error generating metadata JSON:', error);
    }
}

export { generateMetadataJson, fetchMetadataRoutes };
