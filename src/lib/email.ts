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
  source?: string;
}

export async function sendInquiryEmails(data: InquiryEmailData) {
  const { name, phone, email, eventDate, service, budget, message, source } = data;
  const leadSource = source || "Wedding Inquiry Form";

  // Check if lead came from quick Enquiry Modal (no budget selector) vs Wedding Inquiry Form (exact budget selected)
  const isQuickEnquiry =
    leadSource === "Enquiry Now" ||
    !budget ||
    budget === "Flexible" ||
    budget === "To Be Tailored";

  const clientBudgetDisplay = isQuickEnquiry
    ? "Tailored to Your Vision (We will prepare a customized budget proposal during our consultation)"
    : budget;

  const adminBudgetDisplay = isQuickEnquiry
    ? "To Be Tailored (Quick Enquiry - Budget not specified by client)"
    : budget;

  // 1. Email notification to Confianza Admin
  const adminMailOptions = {
    from: `"Confianza Events Concierge" <${EMAIL_HOST_USER}>`,
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: `✨ [${leadSource}] New Inquiry: ${name} (${service || "Planning"})`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #1a1424; margin: 0; padding: 20px; color: #FFFDFC; }
          .container { max-width: 600px; margin: 0 auto; background-color: #2B2138; border-radius: 16px; border: 1px solid #C9A227; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.35); }
          .header { background: linear-gradient(135deg, #3B2A52 0%, #20172B 100%); text-align: center; padding: 32px 20px; border-bottom: 2px solid #C9A227; }
          .logo-title { color: #DFB943; font-size: 26px; font-weight: bold; margin: 0; letter-spacing: 1px; }
          .badge { display: inline-block; background-color: rgba(201, 162, 39, 0.2); border: 1px solid #C9A227; color: #DFB943; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 20px; margin-top: 10px; text-transform: uppercase; letter-spacing: 1.5px; }
          .content { padding: 28px 24px; font-size: 14px; line-height: 1.6; }
          .lead-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(201,162,39,0.25); border-radius: 12px; padding: 18px; margin: 20px 0; }
          .table-row { display: flex; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .label { width: 140px; color: #DFB943; font-weight: 600; font-size: 13px; }
          .value { color: #FFFDFC; font-weight: 500; font-size: 13px; word-break: break-word; }
          .actions { text-align: center; margin: 24px 0 10px 0; }
          .btn-gold { display: inline-block; background: linear-gradient(135deg, #DFB943 0%, #C9A227 100%); color: #20172B; padding: 12px 24px; font-size: 13px; font-weight: bold; border-radius: 8px; text-decoration: none; margin: 6px 4px; }
          .btn-wa { display: inline-block; background: #25D366; color: #ffffff; padding: 12px 24px; font-size: 13px; font-weight: bold; border-radius: 8px; text-decoration: none; margin: 6px 4px; }
          .footer { text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding: 16px; font-size: 11px; color: #A59DB1; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo-title">Confianza Events</h1>
            <span class="badge">New Lead • ${leadSource}</span>
          </div>
          
          <div class="content">
            <p style="font-size: 15px; margin-top: 0;">A new wedding/event consultation request has arrived via the website:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px 0; color: #DFB943; font-weight: 600; width: 140px;">Client Name:</td>
                <td style="padding: 10px 0; color: #FFFDFC; font-weight: bold; font-size: 15px;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px 0; color: #DFB943; font-weight: 600;">Phone / WhatsApp:</td>
                <td style="padding: 10px 0; color: #FFFDFC;"><a href="tel:${phone}" style="color: #DFB943; text-decoration: none; font-weight: bold;">${phone}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px 0; color: #DFB943; font-weight: 600;">Email:</td>
                <td style="padding: 10px 0; color: #FFFDFC;"><a href="mailto:${email}" style="color: #DFB943; text-decoration: none;">${email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px 0; color: #DFB943; font-weight: 600;">Service:</td>
                <td style="padding: 10px 0; color: #FFFDFC;">${service || "Full Wedding Planning"}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px 0; color: #DFB943; font-weight: 600;">Event Date:</td>
                <td style="padding: 10px 0; color: #FFFDFC;">${eventDate || "To Be Finalized"}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px 0; color: #DFB943; font-weight: 600;">Estimated Budget:</td>
                <td style="padding: 10px 0; color: #FFFDFC;">${adminBudgetDisplay}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px 0; color: #DFB943; font-weight: 600;">Form Source:</td>
                <td style="padding: 10px 0; color: #DFB943; font-weight: bold;">${leadSource}</td>
              </tr>
            </table>

            ${
              message
                ? `<div style="margin-top: 20px; background: rgba(255,255,255,0.06); padding: 16px; border-radius: 12px; border-left: 4px solid #C9A227;">
                    <strong style="color: #DFB943; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Client's Custom Requirements:</strong>
                    <p style="margin: 8px 0 0 0; color: #FFFDFC; font-style: italic; line-height: 1.5;">"${message}"</p>
                  </div>`
                : ""
            }

            <div class="actions">
              <a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(name)},%20thank%20you%20for%20reaching%20out%20to%20Confianza%20Events!" target="_blank" class="btn-wa">
                💬 Open WhatsApp Chat
              </a>
              <a href="tel:${phone}" class="btn-gold">
                📞 Call Client Now
              </a>
            </div>
          </div>

          <div class="footer">
            Confianza Event's and Entertainment • Indrayani Complex, Warje, Pune<br/>
            Admin Portal Direct Notification
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // 2. Luxury Client Confirmation Email (Following Confianza Brand Palette)
  const clientMailOptions = {
    from: `"Confianza Event's and Entertainment" <${EMAIL_HOST_USER}>`,
    to: email,
    replyTo: ADMIN_EMAIL,
    subject: `✨ We have received your inquiry — Confianza Events`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Georgia', 'Times New Roman', serif; background-color: #F8F4F8; margin: 0; padding: 24px 12px; color: #2B2138; }
          .email-card { max-width: 600px; margin: 0 auto; background-color: #FFFDFC; border-radius: 20px; border: 1px solid #ECE7E0; box-shadow: 0 12px 40px rgba(109, 76, 155, 0.08); overflow: hidden; }
          .header-banner { background: linear-gradient(135deg, #2B2138 0%, #432E59 50%, #6D4C9B 100%); text-align: center; padding: 36px 20px 30px; position: relative; border-bottom: 3px solid #C9A227; }
          .brand-title { color: #FFFDFC; font-family: 'Georgia', serif; font-size: 28px; margin: 0; letter-spacing: 1px; font-weight: normal; }
          .brand-tagline { color: #DFB943; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; letter-spacing: 3.5px; text-transform: uppercase; margin-top: 8px; font-weight: 600; }
          .body-content { padding: 36px 32px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 15px; line-height: 1.75; color: #3A3245; }
          .greeting { font-family: 'Georgia', serif; font-size: 20px; color: #6D4C9B; margin-top: 0; margin-bottom: 16px; }
          .highlight-card { background: linear-gradient(180deg, #FBF9FC 0%, #F5F0F8 100%); border-radius: 14px; border: 1px solid #E6DCED; border-left: 5px solid #6D4C9B; padding: 20px 22px; margin: 24px 0; }
          .highlight-card h4 { margin: 0 0 12px 0; color: #6D4C9B; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          .summary-table { width: 100%; border-collapse: collapse; font-size: 13px; }
          .summary-table td { padding: 6px 0; vertical-align: top; }
          .summary-label { color: #7B7287; width: 130px; font-weight: 600; }
          .summary-val { color: #2B2138; font-weight: 600; }
          .next-steps-card { background-color: #FFF9EE; border: 1px solid #F3E3C3; border-radius: 12px; padding: 18px 20px; margin: 24px 0; }
          .next-steps-title { color: #9A7513; font-weight: bold; font-size: 14px; margin: 0 0 6px 0; }
          .next-steps-text { color: #695115; font-size: 13px; line-height: 1.6; margin: 0; }
          .founder-signoff { margin-top: 32px; padding-top: 24px; border-top: 1px solid #ECE7E0; }
          .contact-footer-box { background: #2B2138; color: #FFFDFC; text-align: center; padding: 24px 20px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; line-height: 1.6; }
          .contact-link { color: #DFB943; text-decoration: none; font-weight: 600; }
          .footer-copyright { font-size: 11px; color: #A59DB1; margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="email-card">
          <!-- Header Banner -->
          <div class="header-banner">
            <h1 class="brand-title">Confianza Events</h1>
            <div class="brand-tagline">Where Weddings Become Stories</div>
          </div>

          <!-- Body -->
          <div class="body-content">
            <h2 class="greeting">Namaste &amp; Warm Greetings, ${name} ✨</h2>
            
            <p>
              Thank you for considering <strong>Confianza Event's and Entertainment</strong> to craft and execute your special celebration. We have successfully received your inquiry through our website.
            </p>

            <!-- Summary Box -->
            <div class="highlight-card">
              <h4>📋 Your Inquiry Overview</h4>
              <table class="summary-table">
                <tr>
                  <td class="summary-label">Service:</td>
                  <td class="summary-val">${service || "Full Wedding Planning"}</td>
                </tr>
                <tr>
                  <td class="summary-label">Preferred Date:</td>
                  <td class="summary-val">${eventDate || "To Be Finalized"}</td>
                </tr>
                <tr>
                  <td class="summary-label">${isQuickEnquiry ? "Budget Plan:" : "Budget Bracket:"}</td>
                  <td class="summary-val">${clientBudgetDisplay}</td>
                </tr>
                <tr>
                  <td class="summary-label">Contact Phone:</td>
                  <td class="summary-val">${phone}</td>
                </tr>
                ${
                  message
                    ? `<tr>
                        <td class="summary-label">Notes/Vision:</td>
                        <td class="summary-val" style="font-weight: normal; font-style: italic;">"${message}"</td>
                      </tr>`
                    : ""
                }
              </table>
            </div>

            <!-- Next Steps -->
            <div class="next-steps-card">
              <div class="next-steps-title">🌟 What Happens Next?</div>
              <p class="next-steps-text">
                Our founders, <strong>Ashish Wankhede</strong> and <strong>Rutik Pund</strong>, personally oversee every wedding project. We are reviewing your event requirements and our creative team will connect with you via Phone or WhatsApp at <strong>${phone}</strong> shortly to schedule your personalized 1-on-1 vision mapping consultation.
              </p>
            </div>

            <p style="font-size: 14px; color: #5B5267;">
              Whether you are planning a royal destination wedding or an intimate mandap ceremony in Pune, we look forward to bringing your celebration to life with 100% CAD precision, master show running, and heartfelt hospitality.
            </p>

            <!-- Signoff -->
            <div class="founder-signoff">
              <p style="margin: 0; font-size: 14px; color: #2B2138;">
                Warmest regards,<br />
                <strong style="font-family: 'Georgia', serif; font-size: 16px; color: #6D4C9B;">Ashish Wankhede &amp; Rutik Pund</strong><br />
                <span style="font-size: 12px; color: #7B7287;">Founders &amp; Creative Directors, Confianza Events</span>
              </p>
            </div>
          </div>

          <!-- Footer Box -->
          <div class="contact-footer-box">
            <p style="margin: 0 0 6px 0; font-size: 13px;">
              📍 Indrayani Complex, Warje, Pune, Maharashtra — 411058
            </p>
            <p style="margin: 0;">
              📞 Call/WhatsApp: <a href="https://wa.me/919850983389" class="contact-link">+91 9850983389</a> &nbsp;|&nbsp; ✉️ <a href="mailto:confianzaevents@gmail.com" class="contact-link">confianzaevents@gmail.com</a>
            </p>
            <div class="footer-copyright">
              © ${new Date().getFullYear()} Confianza Event's and Entertainment. All rights reserved.
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const [adminRes, clientRes] = await Promise.allSettled([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions),
    ]);
    console.log("Email dispatch results:", {
      admin: adminRes.status,
      client: clientRes.status,
    });
    return { success: true, adminRes, clientRes };
  } catch (error) {
    console.error("Nodemailer error sending emails:", error);
    return { success: false, error };
  }
}

export default transporter;
