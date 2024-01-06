import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { getEvent, updateEvent } from './functions/edit_event.js';

const app = express();
app.use(express.urlencoded({
    extended: true
}))

const port = process.env.PORT || 3000;

const clientConfig = {
    accessToken: process.env.NB_API_TOKEN,
    nationSlug: 'americansforsafeaccess',
    siteSlug: 'americansforsafeaccess',
}

app.get('/', (req, res) => {
    res.send('<h1>OK</h1>')
})


// 1563 is a test event you can use
app.get('/event/:event_id', async (req, res) => {
    const event_id = req.params.event_id;
    const eventData = await getEvent(event_id, clientConfig);
    // console.log(eventData)                                      //debug

    const {
        id,
        status,
        slug,
        name,
        headline,
        intro,
        start_time,
        end_time,
        contact,
        rsvp_form,
        venue,
        capacity,
    } = eventData.event;

    const start = start_time.slice(0, 16)
    const end = end_time.slice(0, 16)
    const tz_offset = start_time.slice(19, 25)

    res.send(`
        <style>
        h1{ text-align: center;}
        .container{margin: auto; padding: 2rem; width: 85vw; max-width: 1200px;}
        fieldset{display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; border: 1px solid #ccc; padding: 1rem; border-radius: 1rem;}
        label{ font-weight: bold; display: block; }
        label:has(+ input[type="checkbox"]){display: inline;}
        input, textarea, select{ margin-bottom: 10px; padding: 4px; border-radius: 4px; border: 1px solid #ccc; }
        .formRow{ min-width: 300px; max-width: 500px;}
        .formRow:last-child{ max-width: unset;}
        textarea{ width: 100%; height: 5rem; }
        .buttons{text-align: center;}
        button{font-size: 1rem; padding: 1rem 2rem; border-radius: 1rem; border: 1px solid #ccc}
        button[type="submit"]{background-color: green;color: white}
        button:hover{background-color: #ccc;}

        </style>
        <div class='container'>
        <h1>Update Event</h1>
        <form action='' id="eventForm" method='post'>
            <input type='hidden' name='id' value='${id}' />
            <input type='hidden' name='status' value='${status}' />
            <input type='hidden' name='tz_offset' value='${tz_offset}' />

            <fieldset>
                <legend>Basic Info</legend>
                <div class='formRow'>
                    <label>Event Headline</label>
                    <input type='text' name="headline" value="${headline || ''}" />
                </div>
                <div class='formRow'>
                    <label>Internal Name</label>
                    <input type='text' name="name" value="${name || ''}" />
                </div>
                <div class='formRow'>
                    <label>Start Date/Time</label>
                    <input type='datetime-local' name="start_time" value="${start}" />
                </div>
                <div class='formRow'>
                    <label>End Date/Time</label>
                    <input type='datetime-local' name="end_time" value="${end}" />
                </div>
                <div class='formRow'>
                    <label>Intro</label>
                    <textarea type='text' name="intro"> ${intro} </textarea>
                </div>
            </fieldset>
            
            <fieldset>
            <legend>Contact</legend>
                <div class='formRow'>
                    <label>Contact Name</label>
                    <input type='text' name="contact_name" value="${contact.name || ''}" />
                </div>
                <div class='formRow'>
                    <label>Contact Phone</label>
                    <input type='tel' name="contact_phone" value="${contact.phone || ''}" />
                </div>
                <div class='formRow'>
                    <label>Hide Contact Phone?</label>
                    <input type='checkbox' name="contact_show_phone" value="${contact.show_phone}" ${contact.show_phone ? 'checked' : ''} />
                </div>
                <div class='formRow'>
                    <label>Contact Email</label>
                    <input type='text' name="contact_email" value="${contact.email || ''}" />
                </div>
                <div class='formRow'>
                    <label>Hide Contact Email?</label>
                    <input type='checkbox' name="contact_show_email" value="${contact.show_email}" ${contact.show_email ? 'checked' : ''} />
                </div>
            </fieldset>
            


            <fieldset>
                <legend>RSVP Form Settings</legend>
                <div class='formRow'>
                    <label>Phone optional?</label>
                    <select name="rsvp_form_phone">
                        <option value="${rsvp_form.phone}">${rsvp_form.phone}</option>
                        <hr />
                        <option value="optional">optional</option>
                        <option value="required">required</option>
                        <option value="hidden">hidden</option>
                    </select>
                </div>
                <div class='formRow'>
                    <label>Address required?</label>
                    <select name="rsvp_form_address">
                        <option value="${rsvp_form.address}">${rsvp_form.address}</option>
                        <hr />
                        <option value="optional">optional</option>
                        <option value="required">required</option>
                        <option value="hidden">hidden</option>
                    </select>
                </div>
                <div class='formRow'>
                    <label>Guests allowed?</label>
                    <input type='checkbox' name="rsvp_form_allow_guests" value="${rsvp_form.allow_guests}" ${rsvp_form.allow_guests ? 'checked' : ''} />
                </div>
                <div class='formRow'>
                    <label>Accept RSVPs?</label>
                    <input type='checkbox' name="rsvp_form_accept_rsvps" value="${rsvp_form.accept_rsvps}" ${rsvp_form.accept_rsvps ? 'checked' : ''} />
                </div>
                <div class='formRow'>
                    <label>Gather volunteers?</label>
                    <input type='checkbox' name="rsvp_form_gather_volunteers" value="${rsvp_form.gather_volunteers}" ${rsvp_form.gather_volunteers ? 'checked' : ''} />
                </div>
            </fieldset>
            
            <fieldset>
            <legend>Venue</legend>
                <div class='formRow'>
                    <label>Name</label>
                    <input type='text' name="venue_name" value="${venue.name || ''}" />
                </div>
                <div class='formRow'>
                    <label>Street Address 1</label>
                    <input type='text' name="venue_address_address1" value="${venue.address.address1 || ''}" />
                </div>
                <div class='formRow'>
                    <label>Street Address 2</label>
                    <input type='text' name="venue_address_address2" value="${venue.address.address2 || ''}" />
                </div>
                <div class='formRow'>
                    <label>City</label>
                    <input type='text' name="venue_address_city" value="${venue.address.city || ''}" />
                </div>
                <div class='formRow'>
                    <label>State</label>
                    <input type='text' name="venue_address_state" value="${venue.address.state || ''}" />
                </div>
                <div class='formRow'>
                    <label>Zip</label>
                    <input type='text' name="venue_address_zip" value="${venue.address.zip || ''}" />
                </div>
                <div class='formRow'>
                    <label>Capacity</label>
                    <input type='text' name="capacity" value="${capacity || ''}" />
                </div>
            </fieldset>
            <div class="buttons">
                <button type="submit" value="Submit">Update</button>
                <button type="reset" value="Reset">Reset</button>
            </div>
        </form>
        </div>
    `)
})


app.post('/event/:event_id', async (req, res) => {

    console.log('req.body.start_time:', req.body.start_time + req.body.tz_offset)          //debug
    console.log('req.body.end_time:', req.body.end_time + req.body.tz_offset)          //debug
    const eventData = {
        event: {
            id: req.body.id,
            status: req.body.status,
            name: req.body.name,
            headline: req.body.headline,
            intro: req.body.intro.trim(),
            start_time: req.body.start_time + req.body.tz_offset,
            end_time: req.body.end_time + req.body.tz_offset,
            contact: {
                name: req.body.contact_name,
                phone: req.body.contact_phone,
                show_phone: req.body.contact_show_phone ? true : false,
                email: req.body.contact_email,
                show_email: req.body.contact_show_email ? true : false,
            },
            rsvp_form: {
                phone: req.body.rsvp_form_phone,
                address: req.body.rsvp_form_address,
                allow_guests: req.body.rsvp_form_allow_guests ? true : false,
                accept_rsvps: req.body.rsvp_form_accept_rsvps ? true : false,
                gather_volunteers: req.body.rsvp_form_gather_volunteers ? true : false,
            },
            capacity: req.body.capacity,
            venue: {
                name: req.body.venue_name,
                address: {
                    address1: req.body.venue_address_address1,
                    address2: req.body.venue_address_address2,
                    city: req.body.venue_address_city,
                    state: req.body.venue_address_state,
                    zip: req.body.venue_address_zip,
                }
            }
        }
    };
    // console.log('eventData:', eventData)                //debug

    const eventResponse = await updateEvent(eventData, clientConfig)
    let output = '';

    //if successful:
    if (eventResponse.event) {
        const { name, id } = eventResponse.event;
        console.log(`Event "${name}" (id: ${id}) has been successfully updated.`);
        output = output + `Event "${name}" (id: ${id}) has been successfully updated.`;
        //if errors:
    } else {
        // console.log('eventResponse:', eventResponse)
        const { code, message, validation_errors } = eventResponse;
        console.error(`Error. ${message}`);
        output = output + `Error. ${message}`;
        output = output + `<ul>`;
        if (validation_errors) {
            Object.values(validation_errors).forEach(err => {
                console.error(`----${err}`);
                output = output + `<li>${err}</li>`;
            });
        }
        output = output + `</ul>`;
    }

    res.send(output);
});







//TESTTS
// 1563 is a test event you can use
// app.get('/event2/:event_id', async (req, res) => {
//     const event_id = req.params.event_id;
//     // console.log(eventData)                                      //debug
//     // console.log(eventData.event.venue.address)                                      //debug


//     const eventData = {
//         "event": {
//             "id": 1563,
//             "status": "unlisted",
//             "name": "A Test Event",
//             "headline": "A Test Event",
//             "intro": "<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius cum neque ex totam iusto magni nesciunt? Minus doloremque in neque sequi iusto aperiam. Ex quasi totam mollitia provident minus laudantium.<br />\r\nUnde voluptatem ex enim rerum aliquid assumenda blanditiis ratione tempore molestiae illo! Necessitatibus consequatur hic asperiores, in perferendis aut itaque libero reiciendis rem maiores accusantium tenetur eveniet enim quo aliquam!<br />\r\nAutem corrupti similique quos necessitatibus tempore atque, aspernatur esse excepturi, fugiat repudiandae maiores alias. Labore pariatur aliquid tenetur non quis accusantium. Doloribus, quos. Cum magnam consectetur, ab neque nesciunt tenetur.<br />\r\nNeque dignissimos nihil est dolorum doloremque, temporibus libero earum minus hic. Temporibus laboriosam nihil perspiciatis necessitatibus! Dolor provident, impedit excepturi voluptatibus quam doloribus, culpa unde ducimus esse ipsam qui! Possimus.<br />\r\nReprehenderit vitae tempora, error veniam nihil assumenda ducimus, saepe aut sequi, sunt doloremque fugit magnam dolor expedita odit quod nam accusamus ea? Optio vero incidunt corporis eveniet sequi. Doloremque, ut?</p>\r\n",
//             "time_zone": "Pacific Time (US & Canada)",
//             "start_time": "2024-03-01T19:00:00-00:00",
//             "end_time": "2024-03-01T22:00:00-00:00",
//             "contact": {
//                 "name": "Jill Tester",
//                 "phone": "1234567890",
//                 "show_phone": true,
//                 "email": "jill@tester.com",
//                 "show_email": true
//             },
//             "rsvp_form": {
//                 "phone": "optional",
//                 "address": "required",
//                 "allow_guests": true,
//                 "accept_rsvps": true,
//                 "gather_volunteers": true
//             },
//             "show_guests": true,
//             "capacity": 250,
//             "venue": {
//                 "name": "Oakland Masonic Temple",
//                 "address": {
//                     "address1": "Lakeshore Drive",
//                     "city": "Oakland",
//                     "state": "CA"
//                 }
//             }
//         }
//     }

//     const {
//         id,
//         status,
//         slug,
//         name,
//         headline,
//         intro,
//         start_time,
//         end_time,
//         contact,
//         rsvp_form,
//         venue,
//         capacity,
//     } = eventData.event;


//     const start = start_time.slice(0, 16)
//     const end = end_time.slice(0, 16)

//     res.send(`
//         <div class='container'>
//         <form action='' id="eventForm" method='post'>
//             <input type='hidden' name='id' value='${id}' />
//             <input type='hidden' name='status' value='${status}' />

//             <div class='formRow'>
//                 <label>Event Headline</label>
//                 <input type='text' name="headline" value="${headline || ''}" />
//             </div>
//             <div class='formRow'>
//                 <label>Internal Name</label>
//                 <input type='text' name="name" value="${name || ''}" />
//             </div>
//             <div class='formRow'>
//                 <label>Intro</label>
//                 <textarea type='text' name="intro"> ${intro} </textarea>
//             </div>
//             <div class='formRow'>
//                 <label>Start Date/Time</label>
//                 <input type='datetime-local' name="start_time" value="${start}" />
//             </div>
//             <div class='formRow'>
//                 <label>End Date/Time</label>
//                 <input type='datetime-local' name="end_time" value="${end}" />
//             </div>
            
//             <fieldset>
//             <legend>Contact</legend>
//                 <div class='formRow'>
//                     <label>Contact Name</label>
//                     <input type='text' name="contact_name" value="${contact.name || ''}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Contact Phone</label>
//                     <input type='tel' name="contact_phone" value="${contact.phone || ''}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Show Contact Phone?</label>
//                     <input type='checkbox' name="contact_show_phone" value="${contact.show_phone}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Contact Email</label>
//                     <input type='text' name="contact_email" value="${contact.email || ''}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Show Contact Email?</label>
//                     <input type='checkbox' name="contact_show_email" value="${contact.show_email}" />
//                 </div>
//             </fieldset>
            


//             <fieldset>
//                 <legend>RSVP Form Settings</legend>
//                 <div class='formRow'>
//                     <label>Phone optional?</label>
//                     <input type='checkbox' name="rsvp_form_phone" value="${rsvp_form.phone}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Address required?</label>
//                     <input type='checkbox' name="rsvp_form_address" value="${rsvp_form.address}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Guests allowed?</label>
//                     <input type='checkbox' name="rsvp_form_allow_guests" value="${rsvp_form.allow_guests}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Accept RSVPs?</label>
//                     <input type='checkbox' name="rsvp_form_accept_rsvps" value="${rsvp_form.accept_rsvps}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Gather volunteers?</label>
//                     <input type='checkbox' name="rsvp_form_gather_volunteers" value="${rsvp_form.gather_volunteers}" />
//                 </div>
//             </fieldset>
            
//             <fieldset>
//             <legend>Venue</legend>
//                 <div class='formRow'>
//                     <label>Name</label>
//                     <input type='text' name="venue_name" value="${venue.name || ''}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Street Address 1</label>
//                     <input type='text' name="venue_address_address1" value="${venue.address.address1 || ''}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Street Address 2</label>
//                     <input type='text' name="venue_address_address2" value="${venue.address.address2 || ''}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>City</label>
//                     <input type='text' name="venue_address_city" value="${venue.address.city || ''}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>State</label>
//                     <input type='text' name="venue_address_state" value="${venue.address.state || ''}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Zip</label>
//                     <input type='text' name="venue_address_zip" value="${venue.address.zip || ''}" />
//                 </div>
//                 <div class='formRow'>
//                     <label>Capacity</label>
//                     <input type='text' name="capacity" value="${capacity || ''}" />
//                 </div>
//             </fieldset>
//             <button type="submit" value="Submit">Update</button>
//             <button type="reset" value="Reset">Reset</button>
//             </form>
//         </div>
//     `)
// })


// app.post('/event2/:event_id', async (req, res) => {

//     console.log('req.body:', req.body)          //debug
//     const eventData = {
//         event: {
//             id: req.body.id,
//             status: req.body.status,
//             name: req.body.name,
//             headline: req.body.headline,
//             intro: req.body.intro,
//             start_time: req.body.start_time,
//             end_time: req.body.end_time,
//             contact: {
//                 name: req.body.contact_name,
//                 phone: req.body.contact_phone,
//                 show_phone: req.body.contact_show_phone,
//                 email: req.body.contact_email,      //THERE IS A SEND CONTACT EMAIL FIELD. DEAL WITH THAT
//                 show_email: req.body.contact_show_email,
//             },
//             rsvp_form: {
//                 phone: req.body.rsvp_form_phone,
//                 address: req.body.rsvp_form_address,
//                 allow_guests: req.body.rsvp_form_allow_guests,
//                 accept_rsvps: req.body.rsvp_form_accept_rsvps,
//                 gather_volunteers: req.body.rsvp_form_gather_volunteers,
//             },
//             capacity: req.body.capacity,
//             venue: {
//                 name: req.body.venue_name,
//                 address: {
//                     address1: req.body.venue_address_address1,
//                     address2: req.body.venue_address_address2,
//                     city: req.body.venue_address_city,
//                     state: req.body.venue_address_state,
//                 }
//             }
//         }
//     };
//     console.log('eventData:', eventData)                //debug

//     const eventResponse = await updateEvent(eventData, clientConfig)
//     let output = '';

//     //if successful:
//     if (eventResponse.event) {
//         const { name, id } = eventResponse.event;
//         console.log(`New event "${name}" (id: ${id}) created.`);
//         output = output + `Event "${name}" (id: ${id}) has been successfully updated.`;
//         //if errors:
//     } else {
//         const { code, message, validation_errors } = eventResponse;
//         console.error(`Error. ${message}`);
//         output = output + `Error. ${message}`;
//         output = output + `<ul>`;
//         Object.values(validation_errors).forEach(err => {
//             console.error(`----${err}`);
//             output = output + `<li>${err}</li>`;
//         });
//         output = output + `</ul>`;
//     }

//     res.send(output)
// });









//





//Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

