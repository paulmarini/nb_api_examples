// const surveyId = 36;

import dotenv from 'dotenv';
dotenv.config();

import nb_call from './nb_call.js';

const clientConfig = {
    accessToken: process.env.NB_API_TOKEN,
    nationSlug: 'americansforsafeaccess',
    siteSlug: 'apitestsite'
}

async function recordSurveyResponses(surveyId, hours) {
    //1) check for responses in last :hours 
    const startTime = Math.floor(Date.now() / 1000) - (3600 * hours);
    const fetchResponseSurveyResponses = await nb_call(clientConfig, 'GET', '/api/v1/survey_responses', null, null, { survey_id: surveyId, start_time: startTime });
    //!! This is giving a 500 error.
    if (fetchResponseSurveyResponses.status !== 200) {
        console.error('fetchResponseSurveyResponses Error.')
        return;
    }
    const surveyResponses = await fetchResponseSurveyResponses.json();

    if (surveyResponses.results === null || surveyResponses.results === {}) {
        console.log('No survey responses found.')
        return;
    }

    //2) if there are any, get survey to use human-readable values 
    const fetchResponseSurvey = await nb_call(clientConfig, 'GET', '/api/v1/sites/:site_slug/pages/surveys/:id', null, surveyId);
    if (fetchResponseSurvey.status !== 200) {
        console.error('fetchResponseSurvey Error.')
        return;
    }
    const survey = await fetchResponseSurvey.json();
    if (survey.results === null || survey.results === {}) {
        console.error('Error: Survey not found.')
        return;
    }
    const surveyData = survey.results;

    //3) get or create contact type "Survey"
    const fetchResponseContactTypes = await nb_call(clientConfig, 'GET', '/api/v1/settings/contact_types', null, null);

    if (fetchResponseContactTypes.status !== 200) {
        console.error('fetchResponseContactTypes Error.')
        return;
    }
    const contactTypes = await fetchResponseContactTypes.json();
    const contactTypesData = contactTypes.results;

    let surveyContactTypeId = contactTypesData.find(ct => ct.name === 'Survey')?.id;
    // console.log('surveyContactTypeId: ', surveyContactTypeId)   //debug
    //4) if Survey type doesn't exist, create it.
    if (!surveyContactTypeId) {
        const contactTypeData = {
            "contact_type": {
                "name": type,
            }
        }
        const fetchResponseNewContactType = await nb_call(clientConfig, 'POST', '/api/v1/settings/contact_types', contactTypeData, null);

        if (fetchResponseNewContactType.status !== 200) {
            console.log('fetchResponseNewContactType Error.')
            return;
        }
        const newContactType = await fetchResponseNewContactType.json();
        // console.log('newContactType: ', newContactType)   //debug
        surveyContactTypeId = newContactType.contact_type.id;
    }

    //5) foreach response, write to Contact
    const surveyResponsesData = surveyResponses.results;

    surveyResponsesData.forEach(async (response) => {

        const person_id = response.person_id;

        let note = `Survey "${surveyData.name}" response: `;
        response.question_responses.forEach(answer => {
            note = note + `${surveyData.questions.find(q => q.id === answer.question_id).text}: ${answer.response}. `;
        })

        const contactData = {
            contact: {
                type_id: surveyContactTypeId,
                method: 'other',
                sender_id: 8,       //my supporer_id
                note: note,
                "created_at": surveyData.created_at
            }
        }

        //record contact:
        const fetchResponseContact = await nb_call(clientConfig, 'POST', `/api/v1/people/:id/contacts`, contactData, person_id);
        if (fetchResponseContact.status !== 200) {
            console.error('fetchResponseContact Error.')
            return;
        }
        const contact = await fetchResponseContact.json();
        // console.log('contact: ', contact)   //debug
        console.log(`Contact recorded for person_id: ${person_id}.`);
    })

}




// const surveyId = 36;

(async () => {
    await recordSurveyResponses(36, 1)
})();