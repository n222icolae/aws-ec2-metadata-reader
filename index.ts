import { generateMetadataJson } from "./src/service/ec2-metadata";

async function main() {
    const args = process.argv.slice(2);
    let result;

    if (args.length === 0) {
        result = await generateMetadataJson();
    } else {
        const metadataKey = args[0];
        result = await generateMetadataJson(metadataKey);
    }

    console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
