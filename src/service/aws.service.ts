import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

const getInstanceMetadata = async (instanceId: string) => {
    const ec2Client = new EC2Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
        }
    });
    const command = new DescribeInstancesCommand({
        InstanceIds: [instanceId]
    });

    const response = await ec2Client.send(command);

    console.log(`Instance ID: ${instanceId}`, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
    console.log(response.Reservations?.[0]?.Instances?.[0]);
    return null;
    //
    // try {
    //     const command = new DescribeInstancesCommand({
    //         InstanceIds: [instanceId]
    //     });
    //
    //     const response = await ec2Client.send(command);
    //     const instance = response.Reservations?.[0]?.Instances?.[0];
    //
    //     if (!instance) {
    //         throw new Error("Instance not found");
    //     }
    //
    //     return {
    //         instanceId: instance.InstanceId,
    //         type: instance.InstanceType,
    //         state: instance.State?.Name,
    //         tags: instance.Tags?.reduce((acc, tag) => {
    //             if (tag.Key && tag.Value) {
    //                 acc[tag.Key] = tag.Value;
    //             }
    //             return acc;
    //         }, {} as Record<string, string>)
    //     };
    // } catch (error) {
    //     console.error("Error retrieving instance details:", error);
    //     throw error;
    // }
};

// // Usage
// const main = async () => {
//     try {
//         const instanceDetails = await getInstanceDetailsBySDK("i-1234567890abcdef0");
//         console.log(JSON.stringify(instanceDetails, null, 2));
//     } catch (error) {
//         console.error("Failed to retrieve instance details:", error);
//     }
// };
//
// if (require.main === module) {
//     main();
// }

export { getInstanceMetadata };
