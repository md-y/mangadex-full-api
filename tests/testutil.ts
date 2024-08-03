import 'dotenv/config';
import { getCurrentAuthClient, loginPersonal } from '../src/index';
import IDObject from '../src/internal/IDObject';

/**
 * Ensures that the user is logged in. If not, logs in with the credentials provided in the environment variables.
 */
export async function ensureLogin() {
    if (!getCurrentAuthClient()) {
        await loginPersonal({
            username: ensureEnv('MFA_TEST_USERNAME'),
            password: ensureEnv('MFA_TEST_PASSWORD'),
            clientId: ensureEnv('MFA_TEST_CLIENT_ID'),
            clientSecret: ensureEnv('MFA_TEST_CLIENT_SECRET'),
        });
    }
}

export function ensureEnv(key: string) {
    const val = process.env[key];
    if (!val) throw new Error(`Missing environment variable: ${key}`);
    return val;
}

export function expectEqualIds(arr1: IDObject[], arr2: IDObject[]) {
    expect(arr1.map((a) => a.id)).toEqual(arr2.map((a) => a.id));
}
