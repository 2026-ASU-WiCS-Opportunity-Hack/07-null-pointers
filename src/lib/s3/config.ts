export interface S3Config {
  region: string;
  bucketName: string;
}

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getS3Config(): S3Config {
  return {
    region: requireEnv("AWS_REGION"),
    bucketName: requireEnv("S3_BUCKET_NAME"),
  };
}

