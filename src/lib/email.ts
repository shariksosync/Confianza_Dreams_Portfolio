import nodemailer from "nodemailer";

const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587", 10);
const EMAIL_HOST_USER = process.env.EMAIL_HOST_USER || "sharikahmed731@gmail.com";
const EMAIL_HOST_PASSWORD = process.env.EMAIL_HOST_PASSWORD || "qijn piou dnrg tovn";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "confianzaevents@gmail.com";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: process.env.SMTP_SECURE === "true", // false for port 587 with STARTTLS
  auth: {
    user: EMAIL_HOST_USER,
    pass: EMAIL_HOST_PASSWORD.replace(/\s+/g, ""), // clean spaces in app password
  },
});

export interface InquiryEmailData {
  name: string;
  phone: string;
  email: string;
  eventDate?: string;
  service?: string;
  budget?: string;
  message?: string;
}

export async function sendInquiryEmails(data: InquiryEmailData) {
  const { name, phone, email, eventDate, service, budget, message } = data;

  // 1. Email notification to Admin
  const adminMailOptions = {
    from: `"Confianza Events Concierge" <${EMAIL_HOST_USER}>`,
    to: ADMIN_EMAIL,
    subject: `✨ New Wedding Inquiry: ${name} (${service || "Planning"})`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #2B2138; color: #FFFDFC; padding: 32px; border-radius: 16px; border: 1px solid #C9A227;">
        <div style="text-align: center; border-bottom: 1px solid rgba(201, 162, 39, 0.3); padding-bottom: 20px;">
          <h1 style="color: #C9A227; margin: 0; font-size: 26px;">Confianza Events</h1>
          <p style="color: #F8F4F8; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px;">New Client Consultation Lead</p>
        </div>
        
        <div style="padding: 24px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #FFFDFC;">
          <p style="font-size: 16px; color: #C9A227;"><strong>A new inquiry has been received:</strong></p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; color: #DFB943; width: 140px;">Client Name:</td>
              <td style="padding: 8px 0; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #DFB943;">Phone / WhatsApp:</td>
              <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #C9A227; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #DFB943;">Email Address:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #C9A227; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #DFB943;">Service Requested:</td>
              <td style="padding: 8px 0;">${service || "Full Wedding Planning"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #DFB943;">Event Date:</td>
              <td style="padding: 8px 0;">${eventDate || "To Be Finalized"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #DFB943;">Estimated Budget:</td>
              <td style="padding: 8px 0;">${budget || "Flexible"}</td>
            </tr>
          </table>

          ${
            message
              ? `<div style="margin-top: 20px; background: rgba(255,255,255,0.08); padding: 16px; border-radius: 12px; border-left: 3px solid #C9A227;">
                  <strong style="color: #C9A227; font-size: 12px; text-transform: uppercase;">Message:</strong>
                  <p style="margin: 6px 0 0 0; color: #FFFDFC; font-style: italic;">"${message}"</p>
                </div>`
              : ""
          }
        </div>

        <div style="text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 16px; font-size: 11px; color: #A59DB1;">
          Confianza Event's and Entertainment • Pune, Maharashtra
        </div>
      </div>
    `,
  };

  // 2. Client Confirmation Email
  const clientMailOptions = {
    from: `"Confianza Events" <${EMAIL_HOST_USER}>`,
    to: email,
    subject: `✨ We have received your inquiry — Confianza Events`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #FFFDFC; color: #4B4453; padding: 36px; border-radius: 16px; border: 1px solid #E5DFD5; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <div style="text-align: center; border-bottom: 1px solid #ECE7E0; padding-bottom: 24px;">
          <h1 style="color: #6D4C9B; margin: 0; font-size: 28px;">Confianza Events</h1>
          <p style="color: #C9A227; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-top: 6px;">Where Weddings Become Stories</p>
        </div>

        <div style="padding: 24px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #4B4453;">
          <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
          <p>
            Thank you for reaching out to Confianza Events. We are delighted to learn about your upcoming celebration.
          </p>
          <p>
            Our founder <strong>Ashish Wankhede</strong> and our creative design director will review your details and contact you via phone/WhatsApp at <strong>${phone}</strong> shortly to discuss your custom mood board, decor concepts, and budget options.
          </p>

          <div style="background-color: #F8F4F8; padding: 18px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #6D4C9B;">
            <p style="margin: 0; font-size: 13px; color: #6D4C9B; font-weight: 600;">Your Inquiry Summary:</p>
            <p style="margin: 4px 0 0 0; font-size: 13px;">Service: <strong>${service || "Wedding Planning"}</strong> | Date: <strong>${eventDate || "TBD"}</strong></p>
          </div>

          <p style="margin-top: 24px;">
            Warm regards,<br />
            <strong>The Confianza Team</strong><br />
            <span style="font-size: 12px; color: #8A8194;">Indrayani Complex, Warje, Pune | +91 9850983389</span>
          </p>
        </div>

        <div style="text-align: center; border-top: 1px solid #ECE7E0; padding-top: 16px; font-size: 11px; color: #8A8194;">
          © ${new Date().getFullYear()} Confianza Event's and Entertainment. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    const [adminRes, clientRes] = await Promise.allSettled([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions),
    ]);
    return { success: true, adminRes, clientRes };
  } catch (error) {
    console.error("Nodemailer error sending emails:", error);
    return { success: false, error };
  }
}

export default transporter;
