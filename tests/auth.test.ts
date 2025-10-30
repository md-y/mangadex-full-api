import { getCurrentAuthClient, loginPersonal } from '../src/index';
import AuthError from '../src/util/AuthError';
import { ensureLogin } from './testutil';

test('Intentionally fail personal login', async () => {
    try {
        await loginPersonal({
            username: Date.now() + 'aaaaaaaa' + Math.random(),
            password: Date.now() + 'bbbbbbbb' + Math.random(),
            clientId: 'aaaaaaaaaaaaaaaaaa',
            clientSecret: 'bbbbbbbbbbbbbbb',
        });
        fail('loginPersonal() should throw an error');
    } catch (e) {
        expect(e).toBeDefined();
        if (!(e instanceof AuthError)) {
            console.error(e);
        }
        expect(e).toBeInstanceOf(AuthError);
    }
});

test('Check personal login', async () => {
    await ensureLogin();
    expect(getCurrentAuthClient()).toBeDefined();
});
