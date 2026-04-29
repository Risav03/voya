import { app } from './app';
import { env } from './env';
import { logger } from './lib/logger';

app.listen(env.API_PORT);
logger.info({ port: env.API_PORT }, 'api listening');
