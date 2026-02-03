import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Admin emails to notify on new signups
const ADMIN_EMAILS = [
  "kyle@felonentrepreneur.com",
  "nate@felonentrepreneur.com",
];

export async function POST(request: Request) {
  try {
    const { userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    // Create transporter using Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.ZOHO_SMTP_USER || "noreply@felonentrepreneur.com",
        pass: process.env.ZOHO_SMTP_PASSWORD,
      },
    });

    // Send notification to all admins
    const mailOptions = {
      from: '"Felon Entrepreneur" <noreply@felonentrepreneur.com>',
      to: ADMIN_EMAILS.join(", "),
      subject: "New Waitlist Signup - Felon Entrepreneur",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Signup Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                <span style="color: #ef4444;">FELON</span> <span style="color: #ffffff;">ENTREPRENEUR</span>
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 2px;">
                Admin Notification
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); border-radius: 16px; border: 1px solid #262626; padding: 40px;">

              <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #22c55e; text-align: center;">
                New Waitlist Signup!
              </h2>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #a3a3a3; text-align: center;">
                Someone just joined the Felon Entrepreneur waitlist.
              </p>

              <!-- User Email -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #111111; border-radius: 12px; border: 1px solid #333333; padding: 20px; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
                      Email Address
                    </p>
                    <p style="margin: 0; font-size: 20px; font-weight: 600; color: #ffffff;">
                      ${userEmail}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 14px; color: #666666; text-align: center;">
                Sent at ${new Date().toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #404040;">
                This is an automated admin notification from Felon Entrepreneur.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `New Waitlist Signup!\n\nSomeone just joined the Felon Entrepreneur waitlist.\n\nEmail: ${userEmail}\n\nSent at ${new Date().toLocaleString()}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin notification error:", error);
    // Don't fail the signup if admin notification fails
    return NextResponse.json(
      { error: "Failed to send admin notification" },
      { status: 500 }
    );
  }
}
