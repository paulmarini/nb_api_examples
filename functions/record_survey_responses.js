// const surveyId = 36;


const clientConfig = {
    accessToken: process.env.NB_API_TOKEN,
    nationSlug: 'americansforsafeaccess',
    siteSlug: 'apitestsite'
}

/**
 * Get Survey Response data, per https://nationbuilder.com/surveys_api
 *   GET /api/v1/survey_responses
 * !! This is giving 500 error currently
 * 
 * 
 * @param {number} surveyId - id of the survey of which to show responses.
 * @param {object} clientConfig - client-specific config info
 * @param {number} hours - number of hours in the past to get responses for. Default: 1
 * @returns {object} response.json() - The survey object on success, an error object on failure
 */
async function getSurveyResponses(surveyId, clientConfig, hours=1) {
    const { accessToken, nationSlug, siteSlug } = clientConfig;
    const startTime = Math.floor(Date.now() / 1000) - (3600 * hours);
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    console.log('surveyId: ', surveyId)
    console.log('startTime: ', startTime)
    console.log('accessToken: ', accessToken)
    const url = `${baseUrl}/api/v1/survey_responses?survey_id=${surveyId}&start_time=${startTime}&access_token=${accessToken}`;
    // const url = `${baseUrl}/api/v1/sites/${siteSlug}/pages/surveys/${surveyId}?access_token=${accessToken}`;
    const fetchOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    };

    try {
        const response = await fetch(url, fetchOptions);
        console.log('response: ', response)
        return response.json();
    } catch (err) {
        if (err) {
            console.error(err);
        }
    }
}

/**
 * Get Survey data, per https://nationbuilder.com/surveys_api (but this isn't listed)
 *   GET /api/v1/sites/:site_slug/pages/surveys/:id 
 * 
 * 
 * @param {number} surveyId - id of the survey of which to show responses.
 * @param {object} clientConfig - client-specific config info
 * @returns {object} response.json() - The survey object on success, an error object on failure
 */
async function getSurvey(surveyId, clientConfig) {
    const { accessToken, nationSlug, siteSlug } = clientConfig;
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = `${baseUrl}/api/v1/sites/${siteSlug}/pages/surveys/${surveyId}?access_token=${accessToken}`;
    const fetchOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    };

    try {
        const response = await fetch(url, fetchOptions);
        console.log('response: ', response)
        return response.json();
    } catch (err) {
        if (err) {
            console.error(err);
        }
    }
}

/**
 * Get CONTACT TYPES 
 * 
 * @param {object} clientConfig - client-specific config info
 * @returns {object} response.json() - The event object on success, an error object on failure
 */
export async function getContactTypes(clientConfig) {
    const { accessToken, nationSlug } = clientConfig;
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


/**
 * Create CONTACT TYPE 
 * 
 * @param {object} clientConfig - client-specific config info
 * @returns {object} response.json() - The event object on success, an error object on failure
 */
export async function createContactType(type, clientConfig) {
    const { accessToken, nationSlug } = clientConfig;
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = `${baseUrl}/api/v1/settings/contact_types?access_token=${accessToken}`;
    contactData = {
        "contact_type": {
               "name": type, 
        }
    }
    
    const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(contactData)
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
 * POST /api/v1/people/:id/contacts

 * 
 * @param {number} person_id 
 * @param {object} contactData 
 * @param {*} created_at 
 * @param {object} siteConfig 
 */
async function recordContact(person_id, contactData, created_at, siteConfig) {
}

//TODO: handle error codes
async function recordSurveyResponses(surveyId, clientConfig, hours) {
    //1) check for responses in last :hours (getSurveyResponses)
    const surveyResponses = await getSurveyResponses(surveyId, clientConfig, hours);

    if (surveyResponses.status !== 200 ) {
        console.log('Error.')
        return;
    }

    if (surveyResponses.results === null ||  surveyResponses.results === {}) {
        console.log('No survey responses found.')
        return;
    }
    const surveyResponsesResults = surveyResponses.results;

    //2) if there are any, get survey to use human-readable values (getSurvey)
    const survey = await getSurvey(surveyId, clientConfig);

    if (survey.status !== 200 ) {
        console.log('Error.')
        return;
    }

    if (survey.results === null ||  survey.results === {}) {
        console.log('Error: Survey not found.')
        return;
    }
    const surveyResults = survey.results;    

    //3) get or create contact type "Survey"
    const contactTypes = await getContactTypes(clientConfig);
    const contactTypesResults = contactTypes.results;
    let surveyContactTypeId = contactTypesResults.find(ct => ct.name === 'Survey')?.id;
    console.log('surveyContactTypeId: ', surveyContactTypeId)   //debug
    if (!surveyContactTypeId) {
        const newContactType = await createContactType('Survey', clientConfig);
        console.log('newContactType: ', newContactType)   //debug
        surveyContactTypeId = newContactType.contact_type.id;
    }

    //3) foreach response, write to Contact
    Object.keys(surveyResponsesResults).forEach(key => {

        const person_id = surveyResponsesResults[key].person_id

        const note = surveyResponsesResultssdjalskfjlasfjalsdkfjldk;fjas;ldkfjasl;dfkjl;kjasdf;kjwefoijdvknsdvoiergoijdkdkdokedoijkiddo

        const contactData = {
            contact: {
                type_id: surveyContactTypeId,
                method: 'other',
                sender_id: 8,       //my supporer_id
                note: '',
                "created_at": surveyResponsesResults[key].created_at
            }
        }

        recordContact(surveyResponsesResults[key].person_id, contactData, surveyResponsesResults[key].created_at, clientConfig);
        console.log(`Contact recorded for person_id: ${surveyResponsesResults[key].person_id}.`);
    })

}





//CHECK SURVEY RESPONSES
// app.get('/survey/:survey_id', async (req, res) => {
//     // Since there is no survey response webhook, normally, this would run on a scheduler 
//     // like node-cron to check every hour for responses since an hour ago (or whatever unit time). 
//     const hours = 1;
//     const survey_id = req.params.survey_id;

//     const surveyResponses = await getSurveyResponses(survey_id, clientConfig, hours)



//     res.send(surveyResponses)
// })

/*


const surveyResponsesResponse = await getSurveyResponses(surveyId, clientConfig);
//if successful:
if (surveyResponsesResponse.results) {
    const { results } = surveyResponsesResponse;        //an array

    results.forEach(result => {
        const { survey_id, person_id, question_responses, created_at } = result;
        recordContact(person_id, question_responses, created_at);
        console.log(`Contact recorded for person_id: ${person_id}.`);
    })

//if errors:
} else {
    const { code, message, validation_errors } = surveyResponsesResponse;
    console.error(`Error. ${message}`);
    if (validation_errors) {
        Object.values(validation_errors).forEach(err => {
            console.error(`----${err}`);
        });
    }
}

*/