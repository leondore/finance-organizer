import type { EmailOptions } from '../types';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const config = useRuntimeConfig();

function generateEmailClient(): SESClient | null {
  if (
    typeof config.awsAccessKey === 'undefined' ||
    config.awsAccessKey === '' ||
    typeof config.awsSecretAccessKey === 'undefined' ||
    config.awsSecretAccessKey === ''
  ) {
    return null;
  }

  return new SESClient({
    region: config.awsRegion,
    credentials: {
      accessKeyId: config.awsAccessKey,
      secretAccessKey: config.awsSecretAccessKey,
    },
  });
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const client = generateEmailClient();
  if (!client) return;

  const params = new SendEmailCommand({
    Source: config.public.fromAddress,
    Destination: {
      ToAddresses: Array.isArray(options.to) ? options.to : [options.to],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: options.subject,
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: options.body,
        },
      },
    },
    ReplyToAddresses: [config.public.replyToAddress],
  });

  try {
    await client.send(params);
  } catch (e) {
    // TODO: Log error to a logging service and create a notification
    console.error('Failed to send email.');
  } finally {
    client.destroy();
  }
};
