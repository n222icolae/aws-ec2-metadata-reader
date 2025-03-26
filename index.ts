import { generateMetadataJson } from "./src/service/aws.service";

async function main() {
    const result = await generateMetadataJson();
    console.log(result);
}

main().catch(console.error);
