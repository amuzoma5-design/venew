import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { title, category, location, date, submitterEmail } = await request.json();

    await resend.emails.send({
      from: "VENEW <noreply@venew.ng>",
      to: "venew100@gmail.com", // replace with your real email
      subject: `New Event Submitted: ${title}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0D0D0D; color: #E8E8E8; padding: 40px; border-radius: 16px;">
          <h1 style="color: #F5A623; font-size: 28px; margin-bottom: 8px;">New Event Submitted!</h1>
          <p style="color: #6B6B6B; margin-bottom: 32px;">Someone just submitted a new event on VENEW. Review and approve it.</p>
          
          <div style="background: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #2A2A2A;">
                <td style="padding: 12px 0; color: #6B6B6B; font-size: 13px; width: 140px;">Event Title</td>
                <td style="padding: 12px 0; color: #E8E8E8; font-size: 14px; font-weight: bold;">${title}</td>
              </tr>
              <tr style="border-bottom: 1px solid #2A2A2A;">
                <td style="padding: 12px 0; color: #6B6B6B; font-size: 13px;">Category</td>
                <td style="padding: 12px 0; color: #E8E8E8; font-size: 14px;">${category}</td>
              </tr>
              <tr style="border-bottom: 1px solid #2A2A2A;">
                <td style="padding: 12px 0; color: #6B6B6B; font-size: 13px;">Location</td>
                <td style="padding: 12px 0; color: #E8E8E8; font-size: 14px;">${location}</td>
              </tr>
              <tr style="border-bottom: 1px solid #2A2A2A;">
                <td style="padding: 12px 0; color: #6B6B6B; font-size: 13px;">Date</td>
                <td style="padding: 12px 0; color: #E8E8E8; font-size: 14px;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6B6B6B; font-size: 13px;">Submitted by</td>
                <td style="padding: 12px 0; color: #E8E8E8; font-size: 14px;">${submitterEmail || "Anonymous"}</td>
              </tr>
            </table>
          </div>

          <a href="https://venew.ng/admin" style="display: inline-block; background: #F5A623; color: #0D0D0D; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 10px; text-decoration: none;">
            Review Event in Admin →
          </a>

          <p style="color: #6B6B6B; font-size: 12px; margin-top: 32px;">
            This email was sent automatically by VENEW.ng
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}