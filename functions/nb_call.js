/**
 * Interact with NationBuilder's API, per https://nationbuilder.com/api_documentation
 * 
 * @param {object} clientConfig - client-specific config info
 * @param {string} method - get, post, etc
 * @param {string} endpoint - partial url of the endpoint
 * @param {object=} data - optional data object, if needed for put and post endpoints
 * @param {number=} id - optional resource ID, if needed for get, put and delete endpoints
 * @param {object=} params - optional parameters
 * @returns {object} response 
 */
export default async function nb_call(clientConfig, method, endpoint, data, id, params={}) {
    const { accessToken, nationSlug, siteSlug } = clientConfig;

    const fetchOptions = {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    };
    if (method === 'POST' || method === 'PUT') { fetchOptions.body = JSON.stringify(data); }

    const queryParams = new URLSearchParams({ ...params, access_token: accessToken });

    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = baseUrl + endpoint.replace(':site_slug', siteSlug).replace(':id', id) + `?${queryParams}`;

    // console.log('fetchOptions: ', fetchOptions)         //debug
    // console.log('url: ', url)                           //debug
    // console.log('queryParams: ', queryParams)           //debug

    try {
        const response = await fetch(url, fetchOptions);
        // console.log('nb_call response: ', response)     //debug
        return response;
    } catch (err) {
        if (err) {
            console.error(`Fetch error: ${err}`);
            throw new Error(err);
        }
    }
}