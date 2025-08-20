//seed.firebase.js
const admin = require('firebase-admin');

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.GOOGLE_APPLICATION_CREDENTIALS = '';

admin.initializeApp({ projectId: 'wedding-rsvp-25b5b' });

const db = admin.firestore();

async function seed() {
  // Seed site schedule data
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

  // Seed site event data
  const eventDocRef = db.collection('site').doc('event');
  const eventData = {
    date: 'June 10, 2028',
    location: 'Seattle, WA',
  };
  await eventDocRef.set(eventData);
  console.log('✅ Seeded: site/event');

  // RSVP deadline
  const rsvpDeadline = admin.firestore.Timestamp.fromDate(
    new Date('2028-06-18T00:00:00-07:00'),
  );

  // Test invitations with easy-to-remember codes
  const testInvitations = [
    // TEST-0001 - Single person, no brunch access
    {
      inviteCode: 'TEST-0001',
      inviteeName: 'Steven Smith',
      allowedToAttendBrunch: false,
      guests: [],
    },

    // TEST-0002 - Person with one named guest, both have brunch access
    {
      inviteCode: 'TEST-0002',
      inviteeName: 'Jane Doe',
      allowedToAttendBrunch: true,
      guests: [{ name: 'John Doe', allowedToAttendBrunch: true }],
    },

    // TEST-0003 - Person with mixed guest setup (named + unnamed)
    {
      inviteCode: 'TEST-0003',
      inviteeName: 'Alice Johnson',
      allowedToAttendBrunch: true,
      guests: [
        { name: 'Bob Johnson', allowedToAttendBrunch: true }, // Named guest
        { name: null, allowedToAttendBrunch: false }, // Unnamed plus-one
      ],
    },

    // TEST-0004 - Person with multiple unnamed guests (plus-ones)
    {
      inviteCode: 'TEST-0004',
      inviteeName: 'Carol White',
      allowedToAttendBrunch: false,
      guests: [
        { name: null, allowedToAttendBrunch: false }, // Plus one
        { name: null, allowedToAttendBrunch: false }, // Plus two
      ],
    },

    // TEST-0005 - Person with no brunch, named guest with brunch (mixed permissions)
    {
      inviteCode: 'TEST-0005',
      inviteeName: 'David Brown',
      allowedToAttendBrunch: false,
      guests: [
        { name: 'Sarah Brown', allowedToAttendBrunch: true }, // Different brunch permission
      ],
    },

    // ADMN-TEST - Admin test account with brunch access
    {
      inviteCode: 'ADMN-TEST',
      inviteeName: 'Wedding Admin',
      allowedToAttendBrunch: true,
      guests: [],
    },

    // LRGE-PRTY - Large party for stress testing
    {
      inviteCode: 'LRGE-PRTY',
      inviteeName: 'Tony Soprano',
      allowedToAttendBrunch: true,
      guests: [
        { name: 'Carmela Soprano', allowedToAttendBrunch: true },
        { name: 'Meadow Soprano', allowedToAttendBrunch: true },
        { name: null, allowedToAttendBrunch: false }, // Plus one
      ],
    },

    // SNGL-GUST - Person with no guests for minimal case testing
    {
      inviteCode: 'SNGL-GUST',
      inviteeName: 'Single Guest',
      allowedToAttendBrunch: false,
      guests: [],
    },
  ];

  // Create RSVP documents
  for (const invitation of testInvitations) {
    const docId = invitation.inviteCode.replace('-', ''); // Remove hyphen for document ID
    const rsvpRef = db.collection('rsvp').doc(docId);

    const rsvpData = {
      invitee: {
        name: invitation.inviteeName,
        dietaryRestrictions: null,
        attendingCeremony: null,
        attendingReception: null,
        attendingBrunch: null,
        allowedToAttendBrunch: invitation.allowedToAttendBrunch,
      },
      guests:
        invitation.guests && invitation.guests.length > 0
          ? invitation.guests.map(guest => ({
              name: guest.name ?? null,
              dietaryRestrictions: null,
              attendingCeremony: null,
              attendingReception: null,
              attendingBrunch: null,
              allowedToAttendBrunch: guest.allowedToAttendBrunch ?? false,
              isNameEditable: guest.name ? false : true, // If no name provided, make it editable
            }))
          : [],
      inviteCode: invitation.inviteCode,
      lastModified: null,
      rsvpDeadline: rsvpDeadline,
    };

    await rsvpRef.set(rsvpData);
    console.log(`✅ Seeded: rsvp/${docId} (${invitation.inviteeName})`);
  }

  console.log('\n🎉 All test data seeded successfully!');
  console.log('\nEasy test codes:');
  console.log('TEST-0001 - Single person, no brunch');
  console.log('TEST-0002 - Couple with brunch access');
  console.log('TEST-0003 - Mixed guest setup');
  console.log('TEST-0004 - Multiple plus-ones');
  console.log('TEST-0005 - Mixed brunch permissions');
  console.log('ADMN-TEST - Admin test account');
  console.log('LRGE-PRTY - Large party test');
  console.log('SNGL-GUST - Single person, minimal case');
}

seed().catch(err => {
  console.error('❌ Error seeding Firestore emulator:', err);
});
