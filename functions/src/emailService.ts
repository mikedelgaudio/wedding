import * as functions from 'firebase-functions';
import { logger } from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import { emailTemplate } from './emailTemplate';

// SMTP configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true'; // true for 465, false for other ports

interface RsvpData {
  inviteeName: string;
  contactInfo: string;
  attendingCeremony: boolean;
  attendingReception: boolean;
  attendingBrunch: boolean;
  foodOption?: string;
  dietaryRestrictions?: string;
  guests?: Array<{
    name: string;
    attendingCeremony: boolean;
    attendingReception: boolean;
    attendingBrunch: boolean;
    foodOption?: string;
    dietaryRestrictions?: string;
  }>;
}

export const sendRsvpConfirmation = functions.https.onCall(async request => {
  logger.info('RSVP confirmation email request received');

  // Validate that we have SMTP configuration
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    logger.error('SMTP configuration missing');
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Email service is not configured',
    );
  }

  // Validate input data
  const rsvpData = request.data as RsvpData;
  if (!rsvpData.inviteeName) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required RSVP data',
    );
  }

  // Create nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  // Check if contact info is a valid email address
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isContactEmail = isValidEmail(rsvpData.contactInfo);

  // Generate email content
  const attendingEvents = [];
  if (rsvpData.attendingCeremony) attendingEvents.push('Wedding Ceremony');
  if (rsvpData.attendingReception) attendingEvents.push('Reception');
  if (rsvpData.attendingBrunch) attendingEvents.push('Brunch');

  const attendingText =
    attendingEvents.length > 0
      ? `You are attending: ${attendingEvents.join(', ')}`
      : 'You are not attending any events';

  let guestDetails = '';
  if (rsvpData.guests && rsvpData.guests.length > 0) {
    guestDetails = '\n\nGuest Details:\n';
    rsvpData.guests.forEach((guest, index) => {
      const guestEvents = [];
      if (guest.attendingCeremony) guestEvents.push('Ceremony');
      if (guest.attendingReception) guestEvents.push('Reception');
      if (guest.attendingBrunch) guestEvents.push('Brunch');

      guestDetails += `${index + 1}. ${guest.name} - ${
        guestEvents.length > 0 ? guestEvents.join(', ') : 'Not attending'
      }`;
      if (guest.foodOption) guestDetails += ` | Food: ${guest.foodOption}`;
      if (guest.dietaryRestrictions)
        guestDetails += ` | Dietary: ${guest.dietaryRestrictions}`;
      guestDetails += '\n';
    });
  }

  // Generate guest details HTML
  const generateGuestDetailsHtml = () => {
    if (!rsvpData.guests || rsvpData.guests.length === 0) return '';

    let guestHtml =
      '<h3 style="color: #44403c; font-size: 18px; margin: 20px 0 10px 0;">Guest Details</h3>';
    guestHtml +=
      '<div style="background-color: #f5f4f2; padding: 15px; border-radius: 8px; margin: 10px 0;">';

    rsvpData.guests.forEach((guest, index) => {
      const guestEvents = [];
      if (guest.attendingCeremony) guestEvents.push('Ceremony');
      if (guest.attendingReception) guestEvents.push('Reception');
      if (guest.attendingBrunch) guestEvents.push('Brunch');

      guestHtml += `
        <div style="margin-bottom: 15px; padding-bottom: 15px; ${
          index < rsvpData.guests!.length - 1
            ? 'border-bottom: 1px solid #d6d3d1;'
            : ''
        }">
          <p style="margin: 5px 0; font-weight: bold; color: #44403c;">${
            index + 1
          }. ${guest.name}</p>
          <p style="margin: 5px 0; color: #57534e;">Attending: ${
            guestEvents.length > 0 ? guestEvents.join(', ') : 'Not attending'
          }</p>
          ${
            guest.foodOption
              ? `<p style="margin: 5px 0; color: #57534e;">Food Option: ${guest.foodOption}</p>`
              : ''
          }
          ${
            guest.dietaryRestrictions
              ? `<p style="margin: 5px 0; color: #57534e;">Dietary Restrictions: ${guest.dietaryRestrictions}</p>`
              : ''
          }
        </div>
      `;
    });

    guestHtml += '</div>';
    return guestHtml;
  };

  // Replace placeholders in HTML template
  const htmlEmailBody = emailTemplate
    .replace(/{{INVITEE_NAME}}/g, rsvpData.inviteeName)
    .replace(/{{ATTENDING_TEXT}}/g, attendingText)
    .replace(
      /{{FOOD_OPTION}}/g,
      rsvpData.foodOption
        ? `<p style="margin: 10px 0 0 0; color: #57534e;"><strong>Food Option:</strong> ${rsvpData.foodOption}</p>`
        : '',
    )
    .replace(
      /{{DIETARY_RESTRICTIONS}}/g,
      rsvpData.dietaryRestrictions
        ? `<p style="margin: 5px 0 0 0; color: #57534e;"><strong>Dietary Restrictions:</strong> ${rsvpData.dietaryRestrictions}</p>`
        : '',
    )
    .replace(/{{GUEST_DETAILS}}/g, generateGuestDetailsHtml());

  try {
    // Always send email to the couple
    await transporter.sendMail({
      from: SMTP_USER,
      to: 'wedding@delgaudio.dev',
      subject: `RSVP Confirmation - ${rsvpData.inviteeName}`,
      html: htmlEmailBody,
    });

    logger.info(
      `RSVP confirmation email sent to couple for ${rsvpData.inviteeName}`,
    );

    // Only send confirmation email to the guest if contact info is an email
    if (isContactEmail) {
      await transporter.sendMail({
        from: SMTP_USER,
        to: rsvpData.contactInfo,
        subject: 'Wedding RSVP Confirmation',
        html: htmlEmailBody,
      });
      logger.info(
        `RSVP confirmation emails sent to couple and guest (${rsvpData.contactInfo}) for ${rsvpData.inviteeName}`,
      );
    } else {
      logger.info(
        `RSVP confirmation email sent to couple only for ${rsvpData.inviteeName} (contact info: ${rsvpData.contactInfo} is not an email)`,
      );
    }

    return { success: true, message: 'Confirmation emails sent successfully' };
  } catch (error) {
    logger.error('Error sending confirmation emails:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send confirmation emails',
    );
  }
});
