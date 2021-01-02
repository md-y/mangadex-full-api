export = MDNet;
/**
 * Object representing the 'Mangadex @ Home' network, referred to here as MDNet.
 */
declare class MDNet {
    /**
     * Returns information about a MDNet client, including
     * its online/offline status, total data served, and its failure rate
     * @param {Number} id The ID of the client
     * @returns {MDNetClient}
     */
    static getClient(id: number): MDNetClient;
    /**
     * Retrieve and fill all clients
     * @returns {Array<MDNetClient>}
     */
    static getAllClients(): Array<MDNetClient>;
}
declare class MDNetClient {
    constructor(id: any);
    id: any;
    available: any;
    bytesServed: any;
    failureRate: any;
    /**
     * Update this client in place.
     */
    update(): Promise<void>;
}
