import { z } from 'zod';

export type EnvironmentVariables = {
  env: 'local' | 'integration' | 'laboratory' | 'production';

  port: number;

  logger: {
    name: string;
    cloudEnv: boolean;
    level: 'silly' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  };
};

export class Configuration {
  private readonly valuesNodeEnv = [
    'local',
    'production',
    'laboratory',
    'integration',
  ] as const;

  private readonly valuesLoggerLevel = [
    'silly',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
  ] as const;

  private static instance: Configuration = undefined;

  private constructor() {}

  static getInstance(): Configuration {
    if (!Configuration.instance) {
      Configuration.instance = new Configuration();
    }

    return Configuration.instance;
  }

  get vars(): EnvironmentVariables {
    const envSchema = z.object({
      NODE_ENV: z.enum(this.valuesNodeEnv),
      PORT: z.coerce.number().optional().default(3000),

      PROJECT_JIRA: z.string(),

      LOGGER_NAME: z.string(),
      LOGGER_LEVEL: z.enum(this.valuesLoggerLevel),
      LOGGER_CLOUD_ENV: z
        .string()
        .optional()
        .default('true')
        .transform((val) => {
          if (val === 'true' || val === '1' || String(val) === '1') {
            return true;
          } else if (val === 'false' || val === '0') {
            return false;
          } else {
            throw new Error(
              'LOGGER_CLOUD_ENV must be "true", "false", "1", or "0"',
            );
          }
        }),
    });

    try {
      const envs = envSchema.parse(process.env);

      return {
        port: envs.PORT,
        env: envs.NODE_ENV,
        logger: {
          name: envs.LOGGER_NAME,
          level: envs.LOGGER_LEVEL,
          cloudEnv: envs.LOGGER_CLOUD_ENV,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Environment variables validation error:', error.issues);
        throw new Error('Invalid environment variables');
      } else {
        throw error;
      }
    }
  }
}
