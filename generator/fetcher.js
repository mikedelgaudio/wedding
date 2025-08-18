import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Initialize Firebase Admin SDK (using your existing setup)
initializeApp({
  credential: cert('./serviceAccountKey.json'),
});

const db = getFirestore();

/**
 * Exports the RSVP collection to CSV in flattened format
 * @param {string} outputFileName - Name of the output CSV file
 */
async function exportRSVPToCSV(outputFileName = 'rsvp-export.csv') {
  try {
    console.log('Exporting RSVP collection...');

    // Get all documents from the rsvp collection
    const snapshot = await db.collection('rsvp').get();

    if (snapshot.empty) {
      console.log('No RSVP documents found.');
      return;
    }

    console.log(`Processing ${snapshot.size} RSVP documents...`);

    // CSV Headers
    const headers = [
      'Name',
      'Attending Ceremony',
      'Attending Reception',
      'Attending Brunch',
      'Allowed Brunch',
      'Dietary Restrictions',
      'Invite Code',
      'Leader',
      'When RSVPd',
    ];

    const rows = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      const inviteCode = data.inviteCode || '';
      const leader = data.invitee?.name || '';
      const whenRsvpd = data.lastModified
        ? data.lastModified.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '';

      // Add invitee row
      rows.push({
        Name: data.invitee?.name || '',
        'Attending Ceremony': data.invitee?.attendingCeremony
          ? data.invitee.attendingCeremony
          : false,
        'Attending Reception': data.invitee?.attendingReception
          ? data.invitee.attendingReception
          : false,
        'Attending Brunch': data.invitee?.attendingBrunch
          ? data.invitee.attendingBrunch
          : false,
        'Allowed Brunch': data.invitee?.allowedToAttendBrunch
          ? data.invitee.allowedToAttendBrunch
          : false,
        'Dietary Restrictions': data.invitee?.dietaryRestrictions || '',
        'Invite Code': inviteCode,
        Leader: leader,
        'When RSVPd': whenRsvpd,
      });

      // Add guest rows
      if (data.guests && Array.isArray(data.guests)) {
        data.guests.forEach(guest => {
          rows.push({
            Name: guest.name || '',
            'Attending Ceremony': guest.attendingCeremony
              ? guest.attendingCeremony
              : false,
            'Attending Reception': guest.attendingReception
              ? guest.attendingReception
              : false,
            'Attending Brunch': guest.attendingBrunch
              ? guest.attendingBrunch
              : false,
            'Allowed Brunch': guest.allowedToAttendBrunch
              ? guest.allowedToAttendBrunch
              : false,
            'Dietary Restrictions': guest.dietaryRestrictions || '',
            'Invite Code': inviteCode,
            Leader: leader,
            'When RSVPd': whenRsvpd,
          });
        });
      }
    });

    // Helper function to escape CSV values
    function escapeCSVValue(value) {
      if (value === null || value === undefined) {
        return '';
      }

      // Convert to string
      value = String(value);

      // Escape quotes and wrap in quotes if necessary
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = '"' + value.replace(/"/g, '""') + '"';
      }

      return value;
    }

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    rows.forEach(row => {
      const csvRow = headers.map(header => escapeCSVValue(row[header]));
      csvContent += csvRow.join(',') + '\n';
    });

    // Write to file
    fs.writeFileSync(outputFileName, csvContent, 'utf8');

    console.log(
      `✅ Successfully exported ${rows.length} people to ${outputFileName}`,
    );
    console.log(`📊 Total RSVP invitations: ${snapshot.size}`);
    console.log(`💰 Firestore reads charged: ${snapshot.size}`);

    // Show sample of the data
    console.log('\n📋 Sample rows:');
    console.log(headers.join(' | '));
    console.log('-'.repeat(80));
    rows.slice(0, 3).forEach(row => {
      console.log(
        headers
          .map(h => String(row[h]).padEnd(15).substring(0, 15))
          .join(' | '),
      );
    });
  } catch (error) {
    console.error('Error exporting RSVP data:', error);
    throw error;
  }
}

// Run the export
exportRSVPToCSV('rsvp-export.csv')
  .then(() => {
    console.log('\n🎉 Export completed! Ready to import into Google Sheets.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Export failed:', error);
    process.exit(1);
  });
