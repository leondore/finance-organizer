import { useDB } from '../utils/db';

export default defineNitroPlugin((nitroApp) => {
  const db = useDB();

  nitroApp.hooks.hook('request', (event) => {
    if (db === null) {
      event.context.db = useDB();
    }
    event.context.db = db;
  });
});
