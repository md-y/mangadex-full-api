const Util = require("../util");

const API = "https://mangadex.network/api/datasources/proxy/1/api/v1/";

/**
 * Object representing the 'Mangadex @ Home' network, referred to here as MDNet.
 */
class MDNet {
    /**
     * Returns information about a MDNet client, including
     * its online/offline status, total data served, and its failure rate
     * @param {Number} id The ID of the client
     * @returns {MDNetClient}
     */
    static getClient(id) {
        if (!id) reject("Invalid id parameter.");

        return new Promise(async (resolve, reject) => {
            const queries = {
                // Querie URLs taken straight from GET request from mangadex.network
                available: 
                    `query?query=mdclient_available{client_id=%22${id.toString()}%22}`,
                bytesServed: 
                    `query?query=sum(increase(mdclient_bytes_served{client_id=%22${id.toString()}%22}[10y]))`,
                failureRate: 
                    `query?query=sum(increase(mdclient_images_served%7Bclient_id%3D%22${id.toString()}%22%2Csuccess%3D%22false%22` +
                    `%2Ccached%3D%22false%22%7D%5B1800s%5D))%2Fsum(increase(mdclient_images_served%7Bclient_id%3D%22${id.toString()}%22%7D%5B1800s%5D))`
            };

            let client = new MDNetClient(id);
            for (let i in queries) {
                let query = API + queries[i];
                
                try {
                    let response = await Util.getJSON(query);
                    if (response.status != "success") continue;
                    if (!response.data || response.data.result.length == 0) continue;

                    let result = response.data.result[0].value[1]; // Actual result metric, not time
                    if (!result) continue;
                    
                    if (i == "available") result = (result == "1"); // Covert to bool
                    else result = parseFloat(result);
                    
                    client[i] = result;
                } catch (err) {
                    continue;
                }
            }
            
            resolve(client);
        });
    }

    /**
     * Retrieve and fill all clients
     * @returns {Array<MDNetClient>}
     */
    static getAllClients() {
        return new Promise((resolve, reject) => {
            const query = API + "series?match[]=mdclient_available";

            Util.getJSON(query).then((res) => {
                if (res.status != "success") reject("API sent failed response for client list.");
                if (!res.data || res.data.length == 0) reject("API sent no client data.");

                let clients = [];
                let clientIDs = res.data.map(e => parseFloat(e.client_id));

                clientIDs.forEach(id => {
                    MDNet.getClient(id).then(client => {
                        clients.push(client);
                        if (clients.length == clientIDs.length) resolve(clients);
                    });
                });
            }).catch(reject);
        });
    }
}

class MDNetClient {
    constructor(id) {
        this.id = id;
        this.available = null;
        this.bytesServed = null;
        this.failureRate = null;
    }

    /**
     * Update this client in place.
     */
    async update() {
        let newClient = await MDNet.getClient(this.id);
        for (let i in newClient) this[i] = newClient[i];
    }
}

module.exports = MDNet;