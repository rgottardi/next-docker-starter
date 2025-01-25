const { Client } = require('pg');
const { MongoClient } = require('mongodb');
const Redis = require('ioredis');
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const nodemailer = require('nodemailer');

async function testPostgres() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('✅ PostgreSQL is connected');
    return true;
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    return false;
  } finally {
    await client.end();
  }
}

async function testMongo() {
  const client = new MongoClient(process.env.MONGODB_URL);
  
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('✅ MongoDB is connected');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    return false;
  } finally {
    await client.close();
  }
}

async function testRedis() {
  const redis = new Redis(process.env.REDIS_URL);
  
  try {
    await redis.ping();
    console.log('✅ Redis is connected');
    return true;
  } catch (err) {
    console.error('❌ Redis connection failed:', err.message);
    return false;
  } finally {
    redis.disconnect();
  }
}

async function testS3() {
  const s3 = new S3Client({
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    forcePathStyle: true
  });

  try {
    const { Buckets } = await s3.send(new ListBucketsCommand({}));
    console.log('✅ LocalStack S3 is connected, buckets:', Buckets.map(b => b.Name).join(', '));
    return true;
  } catch (err) {
    console.error('❌ LocalStack S3 connection failed:', err.message);
    return false;
  }
}

async function testMailhog() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false
  });

  try {
    await transporter.verify();
    console.log('✅ MailHog SMTP is connected');
    return true;
  } catch (err) {
    console.error('❌ MailHog SMTP connection failed:', err.message);
    return false;
  }
}

async function main() {
  const results = await Promise.all([
    testPostgres(),
    testMongo(),
    testRedis(),
    testS3(),
    testMailhog()
  ]);

  const allPassed = results.every(Boolean);
  if (allPassed) {
    console.log('\n🎉 All services are running properly!');
    process.exit(0);
  } else {
    console.error('\n❌ Some services failed their health checks');
    process.exit(1);
  }
}

main().catch(console.error);