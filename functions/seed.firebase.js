const admin = require('firebase-admin');

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.GOOGLE_APPLICATION_CREDENTIALS = ''; // <-- this disables cloud auth

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
    },
    {
      address: '1234 Mickey Mouse Rd, Redmond, WA 98052',
      attire: 'Formal',
      header: 'Reception',
      time: '4:00PM - 10:00PM PDT',
      venue: 'Chateau X',
    },
  ];

  await siteDocRef.set({ events });

  console.log('✅ Firestore emulator seeded with schedule data.');

  // --- Seed: rsvp/ABCD1234 ---
  const rsvpRef = db.collection('rsvp').doc('ABCD1234');

  const rsvpData = {
    invitee: {
      name: 'Steven Smith',
      dietaryRestrictions: null,
      attending: null,
    },
    guests: [
      {
        name: 'Mikey Bolognese',
        dietaryRestrictions: null,
        attending: null,
        isNameEditable: false,
      },
      {
        name: null,
        dietaryRestrictions: null,
        attending: null,
        isNameEditable: true,
      },
    ],
    inviteCode: 'ABCD1234',
    lastModified: admin.firestore.Timestamp.fromDate(
      new Date('2025-07-13T19:56:15-07:00'),
    ),
    rsvpDeadline: admin.firestore.Timestamp.fromDate(
      new Date('2026-06-18T00:00:00-07:00'),
    ),
  };

  await rsvpRef.set(rsvpData);

  console.log('✅ Seeded: rsvp/ABCD1234');
}

seed().catch(err => {
  console.error('❌ Error seeding Firestore emulator:', err);
});
