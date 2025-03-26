import dotenv from "dotenv";
import { getInstanceMetadata } from "./src/service/aws.service";

dotenv.config();

async function main() {
    const result = await getInstanceMetadata("i-0638eae1dce60d689");
    console.log(result);
}

main().catch(console.error);
