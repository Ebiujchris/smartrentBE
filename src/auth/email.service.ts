import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('Email service (Resend) initialized');
    } else {
      this.logger.warn('RESEND_API_KEY not set - emails will be logged to console only');
    }
  }

  async sendPasswordResetEmail(email: string, token: string, fullName: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://smartrent-fe-blush.vercel.app';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    if (!this.resend) {
      // Fallback: log to console for testing
      this.logger.warn(`[DEV MODE] Password reset link for ${email}:`);
      this.logger.warn(resetUrl);
      return;
    }

    try {
      await this.resend.emails.send({
        from: 'SmartRentUG <noreply@smartrentug.com>',
        to: email,
        subject: 'Reset Your Password - SmartRentUG',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0f172a; font-size: 28px; margin: 0;">
                SmartRent<span style="color: #10B981;">UG</span>
              </h1>
              <p style="color: #64748b; margin: 4px 0 0;">Property Management Made Simple</p>
            </div>

            <div style="background: #f8fafc; border-radius: 12px; padding: 32px;">
              <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
              <p style="color: #475569;">Hi <strong>${fullName}</strong>,</p>
              <p style="color: #475569;">We received a request to reset your password. Click the button below to set a new password:</p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}"
                  style="background-color: #10B981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Reset My Password
                </a>
              </div>

              <p style="color: #94a3b8; font-size: 14px;">Or copy this link into your browser:</p>
              <p style="color: #10B981; font-size: 13px; word-break: break-all;">${resetUrl}</p>

              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-top: 24px;">
                <p style="color: #dc2626; margin: 0; font-size: 14px;">
                  ⏰ This link expires in <strong>1 hour</strong>. If you didn't request this, ignore this email.
                </p>
              </div>
            </div>

            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
              © ${new Date().getFullYear()} SmartRentUG · Made by INFINITI ANALYTICS
            </p>
          </div>
        `,
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw new Error('Failed to send password reset email');
    }
  }
}
