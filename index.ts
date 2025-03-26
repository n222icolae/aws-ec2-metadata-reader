import { generateMetadataJson } from "./src/service/aws.service";

async function main() {
    const result = await generateMetadataJson();
    console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
