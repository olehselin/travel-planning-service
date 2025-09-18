// Безкоштовний email сервіс без Firebase Functions
// Використовує EmailJS або Resend API

export interface EmailInviteData {
  to: string;
  tripTitle: string;
  inviteUrl: string;
  inviterName?: string;
  expiresAt: string;
}

export const freeEmailService = {
  /**
   * Відправка запрошення через EmailJS (безкоштовно до 200 email/місяць)
   */
  async sendInviteEmail(
    data: EmailInviteData
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Варіант 1: EmailJS (безкоштовно)
      const emailjsResult = await this.sendViaEmailJS(data);
      if (emailjsResult.success) {
        return emailjsResult;
      }

      // Варіант 2: Resend API (безкоштовно до 3000 email/місяць)
      const resendResult = await this.sendViaResend(data);
      if (resendResult.success) {
        return resendResult;
      }

      // Fallback: показуємо URL в консолі
      return this.showFallbackMessage(data);
    } catch (error) {
      console.error("Error sending email:", error);
      return this.showFallbackMessage(data);
    }
  },

  /**
   * EmailJS - безкоштовно до 200 email/місяць
   */
  async sendViaEmailJS(
    data: EmailInviteData
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Читаємо конфігурацію з localStorage
      const serviceId = "service_2i562uz";
      const templateId = "template_i590mno";
      const publicKey = "10zXowbJZ9HixDV0p";

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS not configured");
      }

      // Динамічний імпорт EmailJS
      const emailjs = await import("@emailjs/browser");

      console.log("Sending EmailJS with data:", {
        serviceId,
        templateId,
        publicKey,
        templateParams: {
          to_email: data.to,
          trip_title: data.tripTitle,
          invite_url: data.inviteUrl,
          expires_at: new Date(data.expiresAt).toLocaleDateString(),
          from_name: "TravelPlanner",
        }
      });

      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: data.to,
          trip_title: data.tripTitle,
          invite_url: data.inviteUrl,
          expires_at: new Date(data.expiresAt).toLocaleDateString(),
          from_name: "TravelPlanner",
        },
        publicKey
      );

      console.log("EmailJS result:", result);

      return {
        success: true,
        message: `Invitation sent to ${data.to} via EmailJS`,
      };
    } catch (error) {
      console.log("EmailJS not available:", error);
      return { success: false, message: "EmailJS not configured" };
    }
  },

  /**
   * Resend API - безкоштовно до 3000 email/місяць
   */
  async sendViaResend(
    data: EmailInviteData
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Читаємо конфігурацію з localStorage
      const config = localStorage.getItem("resend_config");
      if (!config) {
        throw new Error("Resend API not configured");
      }

      const { apiKey } = JSON.parse(config);

      if (!apiKey) {
        throw new Error("Resend API key not configured");
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "TravelPlanner <noreply@yourdomain.com>",
          to: [data.to],
          subject: `You're invited to collaborate on "${data.tripTitle}"`,
          html: this.generateEmailHTML(data),
        }),
      });

      if (response.ok) {
        return {
          success: true,
          message: `Invitation sent to ${data.to} via Resend`,
        };
      } else {
        throw new Error(`Resend API error: ${response.status}`);
      }
    } catch (error) {
      console.log("Resend API not available:", error);
      return { success: false, message: "Resend API not configured" };
    }
  },

  /**
   * Fallback: показуємо URL в консолі
   */
  showFallbackMessage(data: EmailInviteData): {
    success: boolean;
    message: string;
  } {
    console.log("📧 Email would be sent with the following details:");
    console.log("To:", data.to);
    console.log(
      "Subject:",
      `You're invited to collaborate on "${data.tripTitle}"`
    );
    console.log("Invite URL:", data.inviteUrl);
    console.log("Expires at:", data.expiresAt);
    console.log("");
    console.log(
      "🔗 To test the invite, copy this URL and open it in a new tab:"
    );
    console.log(data.inviteUrl);
    console.log("");

    return {
      success: true,
      message: `Invitation created for ${data.to}. Check console for invite URL.`,
    };
  },

  /**
   * Генерація HTML для email
   */
  generateEmailHTML(data: EmailInviteData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0 0 10px 0;">TravelPlanner</h1>
          <p style="color: #666; margin: 0;">Your travel planning companion</p>
        </div>
        
        <h2 style="color: #333; margin-bottom: 20px;">You're invited to collaborate!</h2>
        
        <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
          You have been invited to collaborate on the trip <strong>"${
            data.tripTitle
          }"</strong>.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.inviteUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Accept Invitation
          </a>
        </div>
        
        <div style="background-color: #e9ecef; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>Note:</strong> This invitation will expire on ${new Date(
              data.expiresAt
            ).toLocaleDateString()}.
          </p>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          If you can't click the button above, copy and paste this link into your browser:
          <br>
          <a href="${
            data.inviteUrl
          }" style="color: #007bff; word-break: break-all;">${
      data.inviteUrl
    }</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          This is an automated message. Please do not reply to this email.
          <br>
          If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </div>
    `;
  },

  /**
   * Відправка welcome email
   */
  async sendWelcomeEmail(data: {
    to: string;
    tripTitle: string;
    tripUrl: string;
  }): Promise<{ success: boolean; message: string }> {
    // Аналогічно до sendInviteEmail, але з іншим шаблоном
    return this.showFallbackMessage({
      to: data.to,
      tripTitle: data.tripTitle,
      inviteUrl: data.tripUrl,
      expiresAt: new Date().toISOString(),
    });
  },
};
