//DEPRECATED
// const eventId = 1563;

/**
 * Get Event data, per https://nationbuilder.com/events_api
 *   GET /api/v1/sites/:site_slug/pages/events/:id
 * 
 * @param {number} eventId - id of the event to show and edit. 
 * @param {object} clientConfig - client-specific config info
 * @returns {object} response.json() - The event object on success, an error object on failure
 */
export async function getEvent(eventId, clientConfig) {
    const { accessToken, nationSlug, siteSlug } = clientConfig;
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = `${baseUrl}/api/v1/sites/${siteSlug}/pages/events/${eventId}?access_token=${accessToken}`;
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
 * Update Event data, per https://nationbuilder.com/events_api
 *   PUT /api/v1/sites/:site_slug/pages/events/:id
 * 
 * @param {number} eventId - id of the event to show and edit. Normally selected by user. Here just a static test value.
 * @param {object} clientConfig - client-specific config info
 * @returns {object} response.json() - The event object on success, an error object on failure
 */
export async function updateEvent(eventData, clientConfig) {
    const { accessToken, nationSlug, siteSlug } = clientConfig;
    const eventId = eventData.event.id;
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = `${baseUrl}/api/v1/sites/${siteSlug}/pages/events/${eventId}?access_token=${accessToken}`;
    const fetchOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
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