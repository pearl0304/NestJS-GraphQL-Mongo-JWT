import * as mongoose from 'mongoose';

const database_name = "nest"
export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(`mongodb://localhost/${database_name}`),
  },
];