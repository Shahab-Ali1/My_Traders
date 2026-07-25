export const typeormConfigs = () => {
  return {
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as unknown as number,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    retryAttempts: 0,
  };
};

export default typeormConfigs;
