import dotenv from 'dotenv';
dotenv.config();


const clientConfig = {
    accessToken: process.env.NB_API_TOKEN,
    nationSlug: 'americansforsafeaccess',
    siteSlug: 'apitestsite',
}

const surveyData = {
    "survey": {
        "slug": "testsurvey",
        "name": "Test Survey",
        "status": "published",
        "questions": [{
            "prompt": "What is your favirite color?",
            "external_id": null,
            "slug": "favorite_color",
            "type": "multiple",
            "status": "published",
            "choices": [{
                "name": "Red",
                "feedback": null
            }, {
                "name": "Orange",
                "feedback": null
            }, {
                "name": "Yellow",
                "feedback": "foobar"
            }, {
                "name": "Blue",
                "feedback": null
            }]
        }, {
            "prompt": "What is your favirite number?",
            "external_id": null,
            "slug": "favorite_number",
            "type": "multiple",
            "status": "published",
            "choices": [{
                "name": "1",
                "feedback": "It's simple!"
            }, {
                "name": "i",
                "feedback": "It's imaginary!"
            }, {
                "name": "e",
                "feedback": "It's trancendental!"
            }]
        }]
    }
}

/**
 * Create a new Survey, per https://nationbuilder.com/surveys_api
 *   POST /api/v1/sites/:site_slug/pages/surveys
 * 
 * @param {object} surveyData - Normally user data. In this case test data.
 * @param {object} clientConfig - client-specific config info
 * @returns {object} response.json() - The survey object on success, an error object on failure
 */
export async function createSurvey(surveyData, clientConfig) {
    const { accessToken, nationSlug, siteSlug } = clientConfig;
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = `${baseUrl}/api/v1/sites/${siteSlug}/pages/surveys?access_token=${accessToken}`;
    const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
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

const surveyResponse = await createSurvey(surveyData, clientConfig);
//if successful:
if (surveyResponse.survey) {
    const { name, id } = surveyResponse.survey;
    console.log(`New survey "${name}" (id: ${id}) created.`);
    //if errors:
} else {
    const { code, message, validation_errors } = surveyResponse;
    console.error(`Error. ${message}`);
    if (validation_errors) {
        Object.values(validation_errors).forEach(err => {
            console.error(`----${err}`);
        });
    }
}


