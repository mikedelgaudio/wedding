const admin = require('firebase-admin');

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.GOOGLE_APPLICATION_CREDENTIALS = '';

admin.initializeApp({ projectId: 'wedding-rsvp-25b5b' });

const db = admin.firestore();

async function seed() {
  const siteDocRef = db.collection('site').doc('schedule');

  const events = [
    {
      address: '1234 18th Ave, Seattle, WA 98122',
      attire: 'Formal',
      header: 'Ceremony',
      time: '2:00PM PDT',
      venue: 'Immaculate Church',
      date: 'June 10, 2028',
    },
    {
      address: '1234 Mickey Mouse Rd, Redmond, WA 98052',
      attire: 'Formal',
      header: 'Reception',
      time: '4:00PM - 10:00PM PDT',
      venue: 'Chateau X',
      date: 'June 10, 2028',
    },
  ];

  await siteDocRef.set({ events });

  console.log('✅ Firestore emulator seeded with schedule data.');

  const eventDocRef = db.collection('site').doc('event');
  const eventData = {
    date: 'June 10, 2028',
    location: 'Seattle, WA',
  };
  await eventDocRef.set(eventData);
  console.log('✅ Seeded: site/event');

  // --- Seed: rsvp/ABCD1234 ---
  const rsvpRef = db.collection('rsvp').doc('ABCD1234');

  const rsvpData = {
    invitee: {
      name: 'Steven Smith',
      dietaryRestrictions: null,
      attendingCeremony: null,
      attendingReception: null,
      attendingBrunch: null,
      allowedToAttendBrunch: false,
    },
    guests: [
      {
        name: 'Mikey Bolognese',
        dietaryRestrictions: null,
        isNameEditable: false,
        attendingCeremony: null,
        attendingReception: null,
        attendingBrunch: null,
        allowedToAttendBrunch: false,
      },
      {
        name: null,
        dietaryRestrictions: null,
        attending: null,
        isNameEditable: true,
        attendingCeremony: null,
        attendingReception: null,
        attendingBrunch: null,
        allowedToAttendBrunch: false,
      },
    ],
    inviteCode: 'ABCD1234',
    lastModified: admin.firestore.Timestamp.fromDate(
      new Date('2025-07-13T19:56:15-07:00'),
    ),
    rsvpDeadline: admin.firestore.Timestamp.fromDate(
      new Date('2028-06-18T00:00:00-07:00'),
    ),
  };

  await rsvpRef.set(rsvpData);

  console.log('✅ Seeded: rsvp/ABCD1234');

  const rsvpRef2 = db.collection('rsvp').doc('ABCD4321');

  const rsvpData2 = {
    invitee: {
      name: 'Tony Soprano',
      dietaryRestrictions: null,
      attendingCeremony: null,
      attendingReception: null,
      attendingBrunch: null,
      allowedToAttendBrunch: true,
    },
    guests: null,
    inviteCode: 'ABCD4321',
    lastModified: null,
    rsvpDeadline: new Date('2028-06-18T00:00:00-07:00'),
  };

  await rsvpRef2.set(rsvpData2);

  console.log('✅ Seeded: rsvp/ABCD4321');

  const rsvpRef3 = db.collection('rsvp').doc('DCBA1234');

  const rsvpData3 = {
    invitee: {
      name: 'Alice Johnson',
      dietaryRestrictions: null,
      attendingCeremony: null,
      attendingReception: null,
      attendingBrunch: null,
      allowedToAttendBrunch: true,
    },
    guests: [
      {
        name: null,
        dietaryRestrictions: null,
        attendingCeremony: null,
        attendingReception: null,
        attendingBrunch: null,
        allowedToAttendBrunch: true,
        isNameEditable: true,
      },
      {
        name: null,
        dietaryRestrictions: null,
        attendingCeremony: null,
        attendingReception: null,
        attendingBrunch: null,
        allowedToAttendBrunch: true,
        isNameEditable: true,
      },
    ],
    inviteCode: 'DCBA1234',
    lastModified: null,
    rsvpDeadline: new Date('2028-06-18T00:00:00-07:00'),
  };

  await rsvpRef3.set(rsvpData3);

  console.log('✅ Seeded: rsvp/DCBA1234');

  const rsvpRef4 = db.collection('rsvp').doc('DCBA4321');

  const rsvpData4 = {
    invitee: {
      name: 'Bob Brown',
      dietaryRestrictions: null,
      attendingCeremony: null,
      attendingReception: null,
      attendingBrunch: null,
      allowedToAttendBrunch: false,
    },
    guests: [
      {
        name: 'Jane Doe',
        dietaryRestrictions: null,
        attendingCeremony: null,
        attendingReception: null,
        attendingBrunch: null,
        allowedToAttendBrunch: false,
        isNameEditable: false,
      },
    ],
    inviteCode: 'DCBA4321',
    lastModified: null,
    rsvpDeadline: new Date('2028-06-18T00:00:00-07:00'),
  };

  await rsvpRef4.set(rsvpData4);
  console.log('✅ Seeded: rsvp/DCBA4321');
}

seed().catch(err => {
  console.error('❌ Error seeding Firestore emulator:', err);
});
