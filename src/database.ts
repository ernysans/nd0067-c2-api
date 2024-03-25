import dotenv from 'dotenv';
import {Pool} from 'pg';

dotenv.config();
const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    ENV,
    POSTGRES_TEST_DB,
} = process.env;
let client: Pool;
if (ENV === 'test') {
    console.log('test db -------------------');
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        port: parseInt(POSTGRES_PORT!),
    });
} else {
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        port: parseInt(POSTGRES_PORT!),
    });
}

export default client;
