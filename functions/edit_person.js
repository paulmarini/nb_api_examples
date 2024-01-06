// const personId = 329572;

/**
 * Get Person data, per https://nationbuilder.com/people_api
 *   GET /api/v1/people/:id
 * 
 * @param {number} eventId - id of the person to show and edit. Normally selected by user. Here just a static test value.
 * @param {object} clientConfig - client-specific config info
 * @returns {object} response.json() - The person object on success, an error object on failure
 */
export async function getPerson(personId, clientConfig) {
    const { accessToken, nationSlug } = clientConfig;
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = `${baseUrl}/api/v1/people/${personId}?access_token=${accessToken}`;
    const fetchOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        const response = await fetch(url, fetchOptions);
        return response.json();
    } catch (err) {
        if (err) {
            console.error(err);
        }
    }
}

/**
 * Update Person data, per https://nationbuilder.com/people_api
 *   PUT /api/v1/people/:id
 * 
 * @param {number} personId - id of the person to show and edit. Normally selected by user. Here just a static test value.
 * @param {object} clientConfig - client-specific config info
 * @returns {object} response.json() - The person object on success, an error object on failure
 */
export async function updatePerson(personData, clientConfig) {
    const { accessToken, nationSlug } = clientConfig;
    const personId = personData.person.id;
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = `${baseUrl}/api/v1/people/${personId}?access_token=${accessToken}`;
    const fetchOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personData),
    };

    try {
        const response = await fetch(url, fetchOptions);
        return response.json();
    } catch (err) {
        if (err) {
            console.error(err);
        }
    }
}
