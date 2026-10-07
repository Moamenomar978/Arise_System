export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    // 127.0.0.1 instead of "localhost": on Node 17+ "localhost" can resolve to ::1 (IPv6),
    // while MongoDB listens on IPv4 only, which causes ECONNREFUSED.
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/arise',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secretKey',
  },
});
