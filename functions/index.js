const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin
admin.initializeApp();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransporter({
  service: 'gmail', // You can use other services like SendGrid, AWS SES, etc.
  auth: {
    user: functions.config().email.user, // Set this with: firebase functions:config:set email.user="your-email@gmail.com"
    pass: functions.config().email.password // Set this with: firebase functions:config:set email.password="your-app-password"
  }
});

// Cloud Function to send invitation email
exports.sendInviteEmail = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { to, tripTitle, inviteUrl, expiresAt } = data;

  // Validate input
  if (!to || !tripTitle || !inviteUrl) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  try {
    // Email template
    const mailOptions = {
      from: `"TravelPlanner" <${functions.config().email.user}>`,
      to: to,
      subject: `You're invited to collaborate on "${tripTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #333; margin: 0 0 10px 0;">TravelPlanner</h1>
            <p style="color: #666; margin: 0;">Your travel planning companion</p>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">You're invited to collaborate!</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            You have been invited to collaborate on the trip <strong>"${tripTitle}"</strong>.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Accept Invitation
            </a>
          </div>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Note:</strong> This invitation will expire on ${new Date(expiresAt).toLocaleDateString()}.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            If you can't click the button above, copy and paste this link into your browser:
            <br>
            <a href="${inviteUrl}" style="color: #007bff; word-break: break-all;">${inviteUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            This is an automated message. Please do not reply to this email.
            <br>
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      message: `Invitation email sent to ${to}`
    };

  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});

// Cloud Function to send welcome email
exports.sendWelcomeEmail = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { to, tripTitle, tripUrl } = data;

  // Validate input
  if (!to || !tripTitle || !tripUrl) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  try {
    // Email template
    const mailOptions = {
      from: `"TravelPlanner" <${functions.config().email.user}>`,
      to: to,
      subject: `Welcome to "${tripTitle}"!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #333; margin: 0 0 10px 0;">TravelPlanner</h1>
            <p style="color: #666; margin: 0;">Your travel planning companion</p>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to the team! 🎉</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            You have successfully joined the trip <strong>"${tripTitle}"</strong> as a collaborator.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${tripUrl}" 
               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              View Trip
            </a>
          </div>
          
          <div style="background-color: #d4edda; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #155724; margin: 0 0 10px 0;">What you can do:</h3>
            <ul style="color: #155724; margin: 0; padding-left: 20px;">
              <li>Add, edit, and delete places in the trip</li>
              <li>View trip details and itinerary</li>
              <li>Collaborate with other team members</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            If you can't click the button above, copy and paste this link into your browser:
            <br>
            <a href="${tripUrl}" style="color: #007bff; word-break: break-all;">${tripUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    
    console.log('Welcome email sent successfully:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      message: `Welcome email sent to ${to}`
    };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send welcome email');
  }
});
