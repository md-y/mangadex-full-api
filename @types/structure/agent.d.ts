export = Agent;
/**
 * Represents this API as a user.
 */
declare class Agent {
    /**
     * Current session token
     */
    sessionId: any;
    /**
     * When this session expiries
     */
    sessionExpiration: Date;
    /**
     * Required for maintaining a persistent session.
     * Always used when it's not null.
     */
    persistentId: any;
    /**
     * Using settings.hentai enum.
     * Default: Shown (H and Non-H)
     */
    hentaiSetting: number;
    /**
     * This agent's user object. Filled by agent.fillUser()
     */
    user: User;
    /**
     * Domain override for replacing "mangadex.org" with another domain.
     */
    domainOverride: any;
    /**
     * Retrieves required information and fills this object.
     * @param {String} username
     * @param {String} password
     * @param {Boolean} rememberMe Creates a persistent session viewable at https://mangadex.org/settings (default: false)
     * @returns {Promise}
     */
    login(username: string, password: string, rememberMe?: boolean): Promise<any>;
    /**
     * Checks filepath for a cached sessionId. If none is found,
     * login() is called and the sessionId is cached. The file is stored unencrypted.
     * @param {String} filepath
     * @param {String} username
     * @param {String} password
     * @param {Boolean} persistent Creates a persistent session viewable at https://mangadex.org/settings (default: false)
     * @returns {Promise}
     */
    cacheLogin(filepath: string, username: string, password: string, persistent?: boolean): Promise<any>;
    /**
     * Sends a DM to a target user.
     * Warning: MangaDex only notifies of failed http requests, not message requests
     * (ie your message may not be delivered even on a successful callback).
     * @param {String} target Target user's username
     * @param {String} subject Message Subject
     * @param {String} body Message Body (BBCode Format)
     * @returns {Promise}
     */
    sendMessage(target: string, subject: string, body: string): Promise<any>;
    /**
     * Fills agent.user with the agent's information. It must be logged in.
     */
    fillUser(): any;
    /**
     * Returns (up to) the last 10 manga read by this agent.
     */
    getHistory(): any;
}
import User = require("./user");
