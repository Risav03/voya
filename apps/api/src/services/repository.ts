import { CoreRepository, database } from '@voya/db';

export const coreRepository = new CoreRepository(database.db);
