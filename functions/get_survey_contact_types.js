import dotenv from 'dotenv';
dotenv.config();

const clientConfig = {
    accessToken: process.env.NB_API_TOKEN,
    nationSlug: 'americansforsafeaccess',
}

/**
 * Get CONTACT TYPES 
 * 
 * @param {object} clientConfig - client-specific config info
 * @returns {object} response.json() - The event object on success, an error object on failure
 */
export async function getContactTypes(clientConfig) {
    const { accessToken, nationSlug, siteSlug } = clientConfig;
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = `${baseUrl}/api/v1/settings/contact_types?access_token=${accessToken}`;
    const fetchOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
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

const contactTypes= await getContactTypes(clientConfig);
console.log(contactTypes);
    const contactTypesResults = contactTypes.results;
    const surveyContactId = contactTypesResults.find(ct => ct.name === 'Survey')?.id;
    console.log('surveyContactId: ', surveyContactId)   //debug