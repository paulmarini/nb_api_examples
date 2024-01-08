import dotenv from 'dotenv';
dotenv.config();

import nb_call from './nb_call.js';

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


const fetchResponse = await nb_call(clientConfig, 'POST', '/api/v1/sites/:site_slug/pages/surveys', surveyData, null);
const responseData = await fetchResponse.json();

const successCodes = [200, 201];
if (successCodes.includes(fetchResponse.status)) {
    //success
    const { name, id } = responseData.survey;
    console.log(`New survey "${name}" (id: ${id}) created.`);
} else {
    //error 
    if (responseData.message) {
        const { code, message, validation_errors } = responseData;
        console.error(`Error. ${message}`);
        if (validation_errors) {
            Object.values(validation_errors).forEach(err => {
                console.error(`----${err}`);
            });
        }
    } else {
        console.error(`Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`);
    }
}