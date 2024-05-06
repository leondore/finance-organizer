import { useDB } from '../utils/db';

export default defineNitroPlugin((nitroApp) => {
  const db = useDB();

  nitroApp.hooks.hook('request', (event) => {
    console.log('request hook');
    if (db === null) {
      event.context.db = useDB();
    }
    event.context.db = db;
  });
});
