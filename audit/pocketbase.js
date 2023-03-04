import pocketbase from 'pocketbase';

const pocketbaseClient = pocketbase({
  apiKey: '<your PocketBase API key>',
  databaseUrl: '<your PocketBase database URL>',
});

export default pocketbaseClient;
