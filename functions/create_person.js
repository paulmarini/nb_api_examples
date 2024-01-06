import dotenv from 'dotenv';
dotenv.config();


const clientConfig = {
    accessToken: process.env.NB_API_TOKEN,
    nationSlug: 'americansforsafeaccess',
}

const personData = {
    "person": {
        "email": "test+nbtest@safeaccessnow.org",
        "last_name": "TEST",
        "first_name": "Suzanne",
        "sex": "F",
        "signup_type": 0,
        "employer": "the Illuminati",
        "party": "W",
        "registered_address": {
            "state": "PA",
            "country_code": "US"
        }
    }
}

/**
 * Create a new Person, per https://nationbuilder.com/people_api
 *   POST /api/v1/people
 * 
 * @param {object} personData - Normally user data. In this case test data.
 * @param {object} clientConfig - client-specific config info
 * @returns {object} response.json() - The person object on success, an error object on failure
 */
export async function createPerson(personData, clientConfig) {
    const { accessToken, nationSlug } = clientConfig;
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = `${baseUrl}/api/v1/people?access_token=${accessToken}`;
    const fetchOptions = {
        method: 'POST',
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

const personResponse = await createPerson(personData, clientConfig);
//if successful:
if (personResponse.person) {
    const { full_name, id } = personResponse.person;
    console.log(`New person "${full_name}" (id: ${id}) created.`);
//if errors:
} else {
    const { code, message, validation_errors } = personResponse;
    console.error(`Error. ${message}`);
    if (validation_errors) {
        Object.values(validation_errors).forEach(err => {
            console.error(`----${err}`);
        });
    }
}

