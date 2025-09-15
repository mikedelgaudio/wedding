const email = 'wedding@delgaudio.dev';
const subject = encodeURIComponent('Wedding RSVP Response');
const body = encodeURIComponent(`Please fill out the following information:

Full Name: 

Attending Ceremony: Yes / No
Attending Reception: Yes / No

Dinner Selection: Chicken / Steak / Vegetarian

Contact Phone Number: 

Additional Comments or Dietary Restrictions: 


Thank you!`);

export const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
