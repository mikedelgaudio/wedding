export const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lynh & Michael's Wedding RSVP Confirmation</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
    <div style="background-color: #ffffff; padding: 0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header Photo -->
        <div style="width: 100%; height: 200px; overflow: hidden; border-radius: 12px 12px 0 0;">
            <img src="https://cdn-wedding.delgaudio.dev/public-hero.jpg"
                 alt="Lynh and Michael's Wedding"
                 style="width: 100%; height: 100%; object-fit: cover; display: block; border: none;">
        </div>

        <!-- Header Text -->
        <div style="text-align: center; padding: 30px 30px 20px 30px; border-bottom: 2px solid #d6d3d1;">
            <h1 style="color: #44403c; margin: 0; font-size: 28px; font-weight: 600;">Lynh and Michael's Wedding RSVP Confirmation</h1>
        </div>

        <!-- Content Wrapper -->
        <div style="padding: 30px;">
            <!-- Greeting -->
            <div style="margin-bottom: 25px;">
                <h2 style="color: #2d3748; font-size: 24px; margin: 0 0 15px 0;">Dear {{INVITEE_NAME}},</h2>
                <p style="font-size: 16px; margin: 0; color: #4a5568;">Thank you for submitting your RSVP! We have received your response.</p>
            </div>

            <!-- Attendance Information -->
            <div style="background-color: #f5f4f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #78716c;">
                <h3 style="color: #44403c; font-size: 18px; margin: 0 0 10px 0;">Your Attendance</h3>
                <p style="margin: 0; font-size: 16px; color: #2d3748; font-weight: 500;">{{ATTENDING_TEXT}}</p>
                {{FOOD_OPTION}}
                {{DIETARY_RESTRICTIONS}}
            </div>

            <!-- Guest Details -->
            {{GUEST_DETAILS}}

            <!-- Footer Message -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d6d3d1; text-align: center;">
                <p style="color: #57534e; margin: 0 0 15px 0;">If you have any questions or need to make changes to your RSVP, please contact us at:</p>
                <p style="margin: 0;"><a href="mailto:wedding@delgaudio.dev" style="color: #44403c; text-decoration: underline; font-weight: 500;">wedding@delgaudio.dev</a></p>
            </div>

            <!-- Signature -->
            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 18px; color: #44403c; margin: 0; font-weight: 500;">With love,</p>
                <p style="font-size: 20px; color: #292524; margin: 5px 0 0 0; font-weight: 600;">Lynh & Michael</p>
                <div style="margin-top: 15px; color: #a8a29e; font-size: 24px;">💕</div>
            </div>

            <div style="margin-top: 30px; border-top: 1px solid #d6d3d1; padding-top: 15px; text-align: center;">
                <p style="font-size: 12px; color: #a8a29e; margin: 0;">This is an automated confirmation email. Please do not reply directly to this message.</p>
            </div>
        </div>
    </div>
</body>
</html>`;
