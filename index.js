import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import nb_call from './functions/nb_call.js';

const app = express();
app.use(express.urlencoded({
    extended: true
}))

const port = process.env.PORT || 3000;

const clientConfig = {
    accessToken: process.env.NB_API_TOKEN,
    nationSlug: 'americansforsafeaccess',
    siteSlug: 'apitestsite',
}

app.get('/', (req, res) => {
    res.send('<h1>OK</h1>')
})

//UPDATE EVENT - GET
app.get('/event/:event_id', async (req, res) => {
    // 1563 is a test event you can use
    const event_id = req.params.event_id;

    let output = '';
    const fetchResponse = await nb_call(clientConfig, 'GET', '/api/v1/sites/:site_slug/pages/events/:id', null, event_id);
    // console.log('fetchResponse', fetchResponse)                      //debug

    const successCodes = [200];
    if (successCodes.includes(fetchResponse.status)) {
        //success
        const responseData = await fetchResponse.json();
        console.log(responseData)                                      //debug

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
        } = responseData.event;

        const start = start_time.slice(0, 16);
        const end = end_time.slice(0, 16);
        const tz_offset = start_time.slice(19, 25);

        output = `
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
        button{font-size: 1rem; padding: 1rem 2rem; border-radius: 1rem; border: 1px solid #ccc;}
        button[type="submit"]{background-color: green;color: white;}
        button:hover{background-color: #ccc; color: black; cursor:pointer;}

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
    `;

    } else {
        //error 
        if (fetchResponse.status === 404) {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
            res.send(output);
            return
        }
        const responseData = await fetchResponse.json();
        if (responseData.message) {
            const { code, message, validation_errors } = responseData;
            output = `Error. ${message}`;
            console.error(`Error. ${message}`);
            if (validation_errors) {
                output = output + '<ul>';
                Object.values(validation_errors).forEach(err => {
                    output = output + `<li>${err}</li>`;
                    console.error(`----${err}`);
                });
                output = output + '</ul>';
            }
        } else {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
        }
    }
    res.send(output);
})

//UPDATE EVENT - POST
app.post('/event/:event_id', async (req, res) => {
    let output = '';

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

    const fetchResponse = await nb_call(clientConfig, 'PUT', '/api/v1/sites/:site_slug/pages/events/:id', eventData, req.body.id)

    const successCodes = [200, 201, 204];
    if (successCodes.includes(fetchResponse.status)) {
        //success
        const responseData = await fetchResponse.json();
        console.log(responseData)                                      //debug
        const { name, id } = responseData.event;
        output = `Event "${name}" (id: ${id}) has been successfully updated.`;
        console.log(output);
    } else {
        //error
        if (fetchResponse.status === 404) {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
            res.send(output);
            return
        }
        const responseData = await fetchResponse.json();
        if (responseData.message) {
            const { code, message, validation_errors } = responseData;
            output = `Error. ${message}`;
            console.error(`Error. ${message}`);
            if (validation_errors) {
                output = output + '<ul>';
                Object.values(validation_errors).forEach(err => {
                    output = output + `<li>${err}</li>`;
                    console.error(`----${err}`);
                });
                output = output + '</ul>';
            }
        } else {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
        }
    }

    res.send(output);
});


//CREATE PERSON - GET
app.get('/person/new', async (req, res) => {
    let output = '';
    output = `
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
        button{font-size: 1rem; padding: 1rem 2rem; border-radius: 1rem; border: 1px solid #ccc;}
        button[type="submit"]{background-color: green;color: white;}
        button[type="delete"]{background-color: firebrick;color: white;}
        button:hover{background-color: #ccc; color: black; cursor:pointer;}

        </style>
        <div class='container'>
        <h1>Create New Person</h1>
        <form action='' id="personForm" method='post'>
            <fieldset>
                <legend>Basic Info</legend>
                <div class='formRow'>
                    <label>First Name</label>
                    <input type='text' name="first_name" value="" />
                </div>
                <div class='formRow'>
                    <label>Last Name</label>
                    <input type='text' name="last_name" value="" />
                </div>
            </fieldset>

            <fieldset>
                <legend>Contact Info</legend>
                <div class='formRow'>
                    <label>Do Not Call</label>
                    <input type='checkbox' name="do_not_call" value="true" />
                </div>
                <div class='formRow'>
                    <label>Do Not Contact?</label>
                    <input type='checkbox' name="do_not_contact" value="true" />
                </div>
                <div class='formRow'>
                    <label>Home Phone</label>
                    <input type='tel' name="phone" value="" />
                </div>
                <div class='formRow'>
                    <label>Mobile Phone</label>
                    <input type='tel' name="mobile" value="" />
                </div>
                <div class='formRow'>
                    <label>Mobile Phone Opt-In?</label>
                    <input type='checkbox' name="mobile_opt_in" value="true" />
                </div>
                <div class='formRow'>
                    <label>Email</label>
                    <input type='text' name="email" value="" />
                </div>
                <div class='formRow'>
                    <label>Email Opt-In?</label>
                    <input type='checkbox' name="email_opt_in" value="true" />
                </div>
            </fieldset>
            


            <fieldset>
                <legend>Registered Address</legend>
                <div class='formRow'>
                    <label>Street Address 1</label>
                    <input type='text' name="registered_address_address1" value="" />
                </div>
                <div class='formRow'>
                    <label>Street Address 2</label>
                    <input type='text' name="registered_address_address2" value="" />
                </div>
                <div class='formRow'>
                    <label>City</label>
                    <input type='text' name="registered_address_city" value="" />
                </div>
                <div class='formRow'>
                    <label>State</label>
                    <input type='text' name="registered_address_state" value="" />
                </div>
                <div class='formRow'>
                    <label>Zip</label>
                    <input type='text' name="registered_address_zip" value="" />
                </div>
            </fieldset>
            <div class="buttons">
                <button type="submit" value="Submit">Create</button>
                <button type="reset" value="Reset">Reset</button>
            </div>
        </form>
        </div>
    `;
    res.send(output);
})

//CREATE PERSON - POST
app.post('/person/new', async (req, res) => {
    let output = '';

    const personData = {
        person: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            do_not_call: req.body.do_not_call ? true : false,
            do_not_contact: req.body.do_not_contact ? true : false,
            phone: req.body.phone,
            mobile: req.body.mobile,
            mobile_opt_in: req.body.mobile_opt_in ? true : false,
            email: req.body.email,
            email_opt_in: req.body.email_opt_in ? true : false,
            registered_address: {
                address1: req.body.registered_address_address1,
                address2: req.body.registered_address_address2,
                city: req.body.registered_address_city,
                state: req.body.registered_address_state,
                zip: req.body.registered_address_zip,
            }
        }
    };
    // console.log('personData:', personData)                //debug

    const fetchResponse = await nb_call(clientConfig, 'POST', '/api/v1/people', personData, null);

    const successCodes = [200, 201, 204];
    if (successCodes.includes(fetchResponse.status)) {
        //success
        const responseData = await fetchResponse.json();
        console.log(responseData)                                      //debug
        const { full_name, id } = responseData.person;
        output = `${full_name} (id: ${id}) has been successfully created.`;
        console.log(output);
    } else {
        //error
        if (fetchResponse.status === 404) {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
            res.send(output);
            return
        }
        const responseData = await fetchResponse.json();
        if (responseData.message) {
            const { code, message, validation_errors } = responseData;
            output = `Error. ${message}`;
            console.error(`Error. ${message}`);
            if (validation_errors) {
                output = output + '<ul>';
                Object.values(validation_errors).forEach(err => {
                    output = output + `<li>${err}</li>`;
                    console.error(`----${err}`);
                });
                output = output + '</ul>';
            }
        } else {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
        }
    }

    res.send(output);
});

//UPDATE PERSON - GET
app.get('/person/:person_id', async (req, res) => {
    const person_id = req.params.person_id;

    let output = '';

    const fetchResponse = await nb_call(clientConfig, 'GET', '/api/v1/people/:id', null, person_id);

    const successCodes = [200];
    if (successCodes.includes(fetchResponse.status)) {
        //success
        const responseData = await fetchResponse.json();
        console.log(responseData)                                      //debug

        const {
            id,
            first_name,
            last_name,
            do_not_call,
            do_not_contact,
            phone,
            mobile,
            mobile_opt_in,
            email,
            email_opt_in,
            registered_address
        } = responseData.person;


        output = `
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
        button{font-size: 1rem; padding: 1rem 2rem; border-radius: 1rem; border: 1px solid #ccc;}
        button[type="submit"]{background-color: green;color: white;}
        button[type="delete"]{background-color: firebrick;color: white;}
        button:hover{background-color: #ccc; color: black; cursor:pointer;}

        </style>
        <div class='container'>
        <h1>Update Person</h1>
        <form action='' id="personForm" method='post'>
            <input type='hidden' name='id' value='${id}' />

            <fieldset>
                <legend>Basic Info</legend>
                <div class='formRow'>
                    <label>First Name</label>
                    <input type='text' name="first_name" value="${first_name || ''}" />
                </div>
                <div class='formRow'>
                    <label>Last Name</label>
                    <input type='text' name="last_name" value="${last_name || ''}" />
                </div>
            </fieldset>

            <fieldset>
                <legend>Contact Info</legend>
                <div class='formRow'>
                    <label>Do Not Call</label>
                    <input type='checkbox' name="do_not_call" value="${do_not_call}" ${do_not_call ? 'checked' : ''} />
                </div>
                <div class='formRow'>
                    <label>Do Not Contact?</label>
                    <input type='checkbox' name="do_not_contact" value="${do_not_contact}" ${do_not_contact ? 'checked' : ''} />
                </div>
                <div class='formRow'>
                    <label>Home Phone</label>
                    <input type='tel' name="phone" value="${phone || ''}" />
                </div>
                <div class='formRow'>
                    <label>Mobile Phone</label>
                    <input type='tel' name="mobile" value="${mobile || ''}" />
                </div>
                <div class='formRow'>
                    <label>Mobile Phone Opt-In?</label>
                    <input type='checkbox' name="mobile_opt_in" value="${mobile_opt_in}" ${mobile_opt_in ? 'checked' : ''} />
                </div>
                <div class='formRow'>
                    <label>Email</label>
                    <input type='text' name="email" value="${email || ''}" />
                </div>
                <div class='formRow'>
                    <label>Email Opt-In?</label>
                    <input type='checkbox' name="email_opt_in" value="${email_opt_in}" ${email_opt_in ? 'checked' : ''} />
                </div>
            </fieldset>
            


            <fieldset>
                <legend>Registered Address</legend>
                <div class='formRow'>
                    <label>Street Address 1</label>
                    <input type='text' name="registered_address_address1" value="${registered_address.address1 || ''}" />
                </div>
                <div class='formRow'>
                    <label>Street Address 2</label>
                    <input type='text' name="registered_address_address2" value="${registered_address.address2 || ''}" />
                </div>
                <div class='formRow'>
                    <label>City</label>
                    <input type='text' name="registered_address_city" value="${registered_address.city || ''}" />
                </div>
                <div class='formRow'>
                    <label>State</label>
                    <input type='text' name="registered_address_state" value="${registered_address.state || ''}" />
                </div>
                <div class='formRow'>
                    <label>Zip</label>
                    <input type='text' name="registered_address_zip" value="${registered_address.zip || ''}" />
                </div>
            </fieldset>
            <div class="buttons">
                <button type="submit" value="Submit">Update</button>
                <button type="reset" value="Reset">Reset</button>
            </div>
        </form>
        <div class="buttons">
            <a href="/person/${id}/delete"><button type="delete" value="Delete">Delete</button></a>
        </div>
        </div>
    `;

    } else {
        //error 
        if (fetchResponse.status === 404) {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
            res.send(output);
            return
        }
        const responseData = await fetchResponse.json();
        if (responseData.message) {
            const { code, message, validation_errors } = responseData;
            output = `Error. ${message}`;
            console.error(`Error. ${message}`);
            if (validation_errors) {
                output = output + '<ul>';
                Object.values(validation_errors).forEach(err => {
                    output = output + `<li>${err}</li>`;
                    console.error(`----${err}`);
                });
                output = output + '</ul>';
            }
        } else {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
        }
    }
    res.send(output);
})

//UPDATE PERSON - POST
app.post('/person/:person_id', async (req, res) => {
    let output = '';

    const personData = {
        person: {
            id: req.body.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            do_not_call: req.body.do_not_call ? true : false,
            do_not_contact: req.body.do_not_contact ? true : false,
            phone: req.body.phone,
            mobile: req.body.mobile,
            mobile_opt_in: req.body.mobile_opt_in ? true : false,
            email: req.body.email,
            email_opt_in: req.body.email_opt_in ? true : false,
            registered_address: {
                address1: req.body.registered_address_address1,
                address2: req.body.registered_address_address2,
                city: req.body.registered_address_city,
                state: req.body.registered_address_state,
                zip: req.body.registered_address_zip,
            }
        }
    };
    // console.log('personData:', personData)                //debug


    const fetchResponse = await nb_call(clientConfig, 'PUT', '/api/v1/people/:id', personData, req.body.id)

    const successCodes = [200, 201, 204];
    if (successCodes.includes(fetchResponse.status)) {
        //success
        const responseData = await fetchResponse.json();
        console.log(responseData)                                      //debug
        const { full_name, id } = responseData.person;
        output = `${full_name} (id: ${id}) has been successfully updated.`;
        console.log(output);
        //if errors:
    } else {
        //error
        if (fetchResponse.status === 404) {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
            res.send(output);
            return
        }
        const responseData = await fetchResponse.json();
        if (responseData.message) {
            const { code, message, validation_errors } = responseData;
            output = `Error. ${message}`;
            console.error(`Error. ${message}`);
            if (validation_errors) {
                output = output + '<ul>';
                Object.values(validation_errors).forEach(err => {
                    output = output + `<li>${err}</li>`;
                    console.error(`----${err}`);
                });
                output = output + '</ul>';
            }
        } else {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
        }
    }

    res.send(output);
});

//DELETE PERSON - 
app.get('/person/:person_id/delete', async (req, res) => {
    const person_id = req.params.person_id;

    let output = '';

    const fetchResponse = await nb_call(clientConfig, 'DELETE', '/api/v1/people/:id', null, person_id)

    const successCodes = [200, 201, 204];
    if (successCodes.includes(fetchResponse.status)) {
        //success
        if (fetchResponse.status === 204) {
            output = `Person ${person_id} has been successfully deleted.`;
            console.log(output)
            res.send(output);
            return;
        }
        const responseData = await fetchResponse.json();

        output = responseData;

    } else {
        //error
        if (fetchResponse.status === 404) {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
            res.send(output);
            return
        }
        const responseData = await fetchResponse.json();
        if (responseData.message) {
            const { code, message, validation_errors } = responseData;
            output = `Error. ${message}`;
            console.error(`Error. ${message}`);
            if (validation_errors) {
                output = output + '<ul>';
                Object.values(validation_errors).forEach(err => {
                    output = output + `<li>${err}</li>`;
                    console.error(`----${err}`);
                });
                output = output + '</ul>';
            }
        } else {
            output = `Error. Status: ${fetchResponse.status}. statusText: ${fetchResponse.statusText}`
            console.error(output);
        }
    }

    res.send(output);
});


//Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

