import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASSWORD');

    if (!emailUser || !emailPass) {
      this.logger.warn('Email credentials not configured. Password reset emails will be disabled.');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      await this.transporter!.verify();
      this.logger.log('Email service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize email service:', error.message);
    }
  }

  async sendPasswordResetEmail(email: string, token: string, fullName: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`Skipping email to ${email} - transporter not configured`);
      console.log(`\n🔐 Password Reset Token for ${email}: ${token}\n`);
      return;
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"SmartRentUG" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: email,
      subject: 'Password Reset Request - SmartRentUG',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10B981;">Password Reset Request</h2>
          <p>Hi ${fullName},</p>
          <p>You requested to reset your password for your SmartRentUG account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 14px;">${resetUrl}</p>
          <p style="color: #dc2626; margin-top: 20px;"><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">SmartRentUG - Property Management Made Simple</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}:`, error.message);
      throw new Error('Failed to send password reset email');
    }
  }
}
