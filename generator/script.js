import crypto from 'crypto';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK for local usage
// Option 1: Using service account key file
initializeApp({
  credential: cert('./serviceAccountKey.json'), // Path to your service account key
});

const db = getFirestore();

/**
 * Generates a cryptographically secure alphanumeric code in XXXX-XXXX format
 * Uses crypto.randomBytes for security against brute force attacks
 */
function generateSecureInviteCode() {
  // Generate 8 random bytes (64 bits of entropy)
  const randomBytes = crypto.randomBytes(5);

  // Convert to alphanumeric string (uppercase letters and numbers only)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  // Use the random bytes to select characters
  for (let i = 0; i < 8; i++) {
    const randomIndex = randomBytes[i % 5] % chars.length;
    code += chars[randomIndex];
  }

  // Format as XXXX-XXXX
  return `${code.slice(0, 4)}-${code.slice(4, 8)}`;
}

/**
 * Checks if an invite code already exists in the database
 */
async function isCodeUnique(code) {
  try {
    const doc = await db.collection('rsvp').doc(code.replace('-', '')).get();
    return !doc.exists;
  } catch (error) {
    console.error('Error checking code uniqueness:', error);
    return false;
  }
}

/**
 * Generates a unique invite code by checking against existing codes
 */
async function generateUniqueInviteCode(maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const code = generateSecureInviteCode();
    if (await isCodeUnique(code)) {
      return code;
    }
  }
  throw new Error(
    'Failed to generate unique invite code after maximum attempts',
  );
}

/**
 * Creates RSVP documents in Firestore based on JSON input
 * @param {Array} invitationsData - Array of invitation objects
 * @param {Date} rsvpDeadline - Deadline for RSVPs
 */
async function generateRSVPInvitations(invitationsData, rsvpDeadline) {
  const batch = db.batch();
  const generatedCodes = [];

  try {
    for (const invitation of invitationsData) {
      // Generate unique invite code
      const inviteCode = await generateUniqueInviteCode();
      const docId = inviteCode.replace('-', ''); // Remove hyphen for document ID

      // Create RSVP document reference
      const rsvpRef = db.collection('rsvp').doc(docId);

      // Prepare RSVP data
      const rsvpData = {
        invitee: {
          name: invitation.inviteeName,
          dietaryRestrictions: null,
          attendingCeremony: null,
          attendingReception: null,
          attendingBrunch: null,
          allowedToAttendBrunch: invitation.allowedToAttendBrunch ?? false,
          foodOption: null,
          contactInfo: null,
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
                foodOption: null,
                contactInfo: null,
              }))
            : [],
        inviteCode,
        lastModified: null,
        rsvpDeadline: Timestamp.fromDate(rsvpDeadline),
      };

      // Add to batch
      batch.set(rsvpRef, rsvpData);
      generatedCodes.push({
        inviteeName: invitation.inviteeName,
        inviteCode: inviteCode,
        docId: docId,
      });

      console.log(
        `Prepared invitation for ${invitation.inviteeName} with code: ${inviteCode}`,
      );
    }

    // Commit all documents at once
    await batch.commit();
    console.log(
      `Successfully created ${generatedCodes.length} RSVP invitations`,
    );

    return generatedCodes;
  } catch (error) {
    console.error('Error generating RSVP invitations:', error);
    throw error;
  }
}

/**
 * Example usage function
 */
async function example() {
  // Example JSON data structure
  const sampleInvitations = [
    {
      inviteeName: 'Steven Smith',
      allowedToAttendBrunch: false,
      guests: [
        { name: 'Mikey Bolognese', allowedToAttendBrunch: false }, // Guest with fixed name
        { name: null, allowedToAttendBrunch: true }, // Guest with editable name
      ],
    },
    {
      inviteeName: 'Jane Doe',
      allowedToAttendBrunch: true,
      guests: [{ name: 'John Doe', allowedToAttendBrunch: true }],
    },
    {
      inviteeName: 'Jane Doe2',
      allowedToAttendBrunch: false,
      guests: [{ name: 'John Doe2', allowedToAttendBrunch: false }],
    },
    {
      inviteeName: 'Alice Johnson',
      allowedToAttendBrunch: false,
      guests: [
        { name: null, allowedToAttendBrunch: false }, // Plus one with editable name
        { name: null, allowedToAttendBrunch: false }, // Another plus one
      ],
    },
    {
      inviteeName: 'Bob Brown',
      allowedToAttendBrunch: true,
    },
    {
      inviteeName: 'Bob Brown2',
      allowedToAttendBrunch: false,
    },
  ];

  // Set RSVP deadline
  const rsvpDeadline = new Date('2028-06-18T00:00:00-07:00');

  try {
    const results = await generateRSVPInvitations(
      sampleInvitations,
      rsvpDeadline,
    );

    console.log('\nGenerated invite codes:');
    results.forEach(result => {
      console.log(`${result.inviteeName}: ${result.inviteCode}`);
    });
  } catch (error) {
    console.error('Failed to generate invitations:', error);
  }
}

// Export functions for use in other modules
export {
  generateRSVPInvitations,
  generateSecureInviteCode,
  generateUniqueInviteCode,
};

// Uncomment the line below to run the example
example();
