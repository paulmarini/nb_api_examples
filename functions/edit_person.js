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

/**
 * Delete Person record, per https://nationbuilder.com/people_api
 *   DELETE /api/v1/people/:id
 * 
 * @param {number} personId - id of the person to delete. Normally selected by user. Here just a static test value.
 * @param {object} clientConfig - client-specific config info
 * @returns {string} - Success or failure message 
 */
export async function deletePerson(personId, clientConfig) {
    const { accessToken, nationSlug } = clientConfig;
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = `${baseUrl}/api/v1/people/${personId}?access_token=${accessToken}`;
    const fetchOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    };

    let output = '';

    try {
        const response = await fetch(url, fetchOptions);
        //if successful:
        if (response.status === 204) {
            console.log(`Person ${personId} has been successfully deleted.`);
            output = `Person ${personId} has been successfully deleted.`;
        //if errors:
        } else {
            // console.log('personResponse:', personResponse)
            const { code, message, validation_errors } = response;
            console.error(`Error. ${message}`);
            output = output + `Error. ${message}`;
            output = output + `<ul>`;
            if (validation_errors) {
                Object.values(validation_errors).forEach(err => {
                    console.error(`----${err}`);
                    output = output + `<li>${err}</li>`;
                });
            }
            output = output + `</ul>`;
        }
    } catch (err) {
        if (err) {
            console.error(err);
        }
    }
    return output;
}
