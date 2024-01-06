import dotenv from 'dotenv';
dotenv.config();


const clientConfig = {
    accessToken: process.env.NB_API_TOKEN,
    nationSlug: 'americansforsafeaccess',
    siteSlug: 'americansforsafeaccess',
    baseUrl: `https://${nationSlug}.nationbuilder.com/`
}


const eventData = {
    "event": {
        "status": "unlisted",
        "name": "A Test Event",
        "intro": "<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius cum neque ex totam iusto magni nesciunt? Minus doloremque in neque sequi iusto aperiam. Ex quasi totam mollitia provident minus laudantium.<br />\r\nUnde voluptatem ex enim rerum aliquid assumenda blanditiis ratione tempore molestiae illo! Necessitatibus consequatur hic asperiores, in perferendis aut itaque libero reiciendis rem maiores accusantium tenetur eveniet enim quo aliquam!<br />\r\nAutem corrupti similique quos necessitatibus tempore atque, aspernatur esse excepturi, fugiat repudiandae maiores alias. Labore pariatur aliquid tenetur non quis accusantium. Doloribus, quos. Cum magnam consectetur, ab neque nesciunt tenetur.<br />\r\nNeque dignissimos nihil est dolorum doloremque, temporibus libero earum minus hic. Temporibus laboriosam nihil perspiciatis necessitatibus! Dolor provident, impedit excepturi voluptatibus quam doloribus, culpa unde ducimus esse ipsam qui! Possimus.<br />\r\nReprehenderit vitae tempora, error veniam nihil assumenda ducimus, saepe aut sequi, sunt doloremque fugit magnam dolor expedita odit quod nam accusamus ea? Optio vero incidunt corporis eveniet sequi. Doloremque, ut?</p>\r\n",
        "time_zone": "Pacific Time (US & Canada)",
        "start_time": "2024-03-01T19:00:00-05:00",
        "end_time": "2024-03-01T22:00:00-05:00",
        "contact": {
            "name": "Jill Tester",
            "phone": "1234567890",
            "show_phone": true,
            "email": "jill@tester.com",
            "show_email": true
        },
        "rsvp_form": {
            "phone": "optional",
            "address": "required",
            "allow_guests": true,
            "accept_rsvps": true,
            "gather_volunteers": true
        },
        "show_guests": true,
        "capacity": 250,
        "venue": {
            "name": "Oakland Masonic Temple",
            "address": {
                "address1": "Lakeshore Drive",
                "city": "Oakland",
                "state": "CA"
            }
        }
    }
}


/**
 * Create a new Event, per https://nationbuilder.com/events_api
 *   POST /api/v1/sites/:site_slug/pages/events
 * 
 * @param {object} eventData - Normally user data. In this case test data.
 * @param {object} clientConfig - client-specific config info
 * @returns {object} response.json() - The event object on success, an error object on failure
 */
async function createEvent(eventData, clientConfig) {
    const { accessToken, nationSlug, siteSlug } = clientConfig;
    const baseUrl = `https://${nationSlug}.nationbuilder.com`
    const url = `${baseUrl}/api/v1/sites/${siteSlug}/pages/events?access_token=${accessToken}`;
    const fetchOptions = {
        method: 'POST',
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

const eventResponse = await createEvent();
//if successful:
if (eventResponse.event) {
    const { name, id } = eventResponse.event;
    console.log(`New event "${name}" (id: ${id}) created.`);
    //if errors:
} else {
    const { code, message, validation_errors } = eventResponse;
    console.error(`Error. ${message}`);
    if (validation_errors) {
        Object.values(validation_errors).forEach(err => {
            console.error(`----${err}`);
        });
    }
}

