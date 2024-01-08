import dotenv from 'dotenv';
dotenv.config();

import nb_call from './nb_call.js';

const clientConfig = {
    accessToken: process.env.NB_API_TOKEN,
    nationSlug: 'americansforsafeaccess',
}

const personData = {
    "person": {
        "email": "test+nbtest3@safeaccessnow.org",
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


const fetchResponse = await nb_call(clientConfig, 'POST', '/api/v1/people', personData, null);
const responseData = await fetchResponse.json();

const successCodes = [200, 201];
if (successCodes.includes(fetchResponse.status)) {
    //success
    const { full_name, id } = responseData.person;
    console.log(`New person "${full_name}" (id: ${id}) created.`);
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