import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export interface S3Credentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export async function uploadToS3(
  stream: Readable,
  bucketName: string,
  objectKey: string,
  credentials: S3Credentials
) {
  const s3Client = new S3Client({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  });

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: objectKey,
        Body: stream,
      },
    });

    let lastLogged = 0;
    upload.on('httpUploadProgress', (progress) => {
      // Log every 5MB to avoid spamming the console
      if (progress.loaded && progress.loaded - lastLogged > 5 * 1024 * 1024) {
        console.log(`[S3 Upload Progress] ${Math.round(progress.loaded / 1024 / 1024)}MB uploaded...`);
        lastLogged = progress.loaded;
      }
    });

    const result = await upload.done();
    console.log(`✅ Successfully uploaded to S3: ${result.Location}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to upload to S3:`, error);
    throw error;
  }
}
