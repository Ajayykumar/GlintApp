import Redis from "ioredis";

const redis = new (Redis as unknown as typeof import("ioredis").default)(
  process.env.REDIS_DATABASE_URI!
);


console.log("Redis connected");

export default redis;
