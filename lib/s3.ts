import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export async function uploadToS3(buffer: Buffer, filename: string, contentType: string) {
    const bucketName = process.env.AWS_BUCKET_NAME || "butterfly-couture-assets";

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `uploads/${filename}`,
        Body: buffer,
        ContentType: contentType,
    });

    await s3Client.send(command);

    // Construct the public URL
    // Note: This assumes the bucket/object is public or you are using a CDN
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${filename}`;
}
