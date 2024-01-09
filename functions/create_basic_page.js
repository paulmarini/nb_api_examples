import dotenv from 'dotenv';
dotenv.config();

import nb_call from './nb_call.js';

const clientConfig = {
    accessToken: process.env.NB_API_TOKEN,
    nationSlug: 'americansforsafeaccess',
    siteSlug: 'apitestsite',
}

const basicPageData = {
  "basic_page": {
    "name": "NewUserProfiles",
    "content": "<p>This page lists users created here: <a href='/person/new'>/person/new</a></p>",
    "status": "published"
  }
}

const fetchResponse = await nb_call(clientConfig, 'POST', '/api/v1/sites/:site_slug/pages/basic_pages', basicPageData, null);
const responseData = await fetchResponse.json();

const successCodes = [200, 201];
if (successCodes.includes(fetchResponse.status)) {
    //success
    const { slug, id } = responseData.basic_page;
    console.log(`New Basic Page "${slug}" (id: ${id}) created.`);
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