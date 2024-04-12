import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const s3Client = new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: config.awsAccessKey,
      secretAccessKey: config.awsSecretAccessKey,
    },
  });

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.attachmentsBucket,
        Key: 'my-first-object.txt',
        Body: 'Hello JavaScript SDK!',
      })
    );
  } catch (err) {
    console.error(err);
  }

  setResponseStatus(event, 201, 'OK');
  return;
});
