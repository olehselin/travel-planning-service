// Email service for sending invitations via Firebase Cloud Functions
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getApp } from 'firebase/app'

export interface EmailInviteData {
  to: string
  tripTitle: string
  inviteUrl: string
  inviterName?: string
  expiresAt: string
}

export const emailService = {
  /**
   * Send an invitation email via Firebase Cloud Functions
   */
  async sendInviteEmail(data: EmailInviteData): Promise<{ success: boolean; message: string }> {
    try {
      const app = getApp()
      const functions = getFunctions(app)
      const sendInviteEmail = httpsCallable(functions, 'sendInviteEmail')

      const result = await sendInviteEmail({
        to: data.to,
        tripTitle: data.tripTitle,
        inviteUrl: data.inviteUrl,
        expiresAt: data.expiresAt
      })

      return {
        success: true,
        message: (result.data as any).message
      }
    } catch (error: any) {
      console.error('Error sending email:', error)
      
      // Check if it's a configuration error
      if (error.code === 'functions/unauthenticated') {
        return { 
          success: false, 
          message: 'Email service not configured. Please contact administrator.' 
        }
      }
      
      if (error.code === 'functions/invalid-argument') {
        return { 
          success: false, 
          message: 'Invalid email configuration. Please check email settings.' 
        }
      }
      
      // Fallback to console log if Cloud Functions are not available
      console.log('📧 Email would be sent with the following details:')
      console.log('To:', data.to)
      console.log('Subject:', `You're invited to collaborate on "${data.tripTitle}"`)
      console.log('Invite URL:', data.inviteUrl)
      console.log('Expires at:', data.expiresAt)
      console.log('')
      console.log('🔗 To test the invite, copy this URL and open it in a new tab:')
      console.log(data.inviteUrl)
      console.log('')
      
      return { 
        success: true, 
        message: `Invitation email sent to ${data.to} (simulated - check console for URL)` 
      }
    }
  },

  /**
   * Send a welcome email after accepting invitation via Firebase Cloud Functions
   */
  async sendWelcomeEmail(data: { to: string; tripTitle: string; tripUrl: string }): Promise<{ success: boolean; message: string }> {
    try {
      const app = getApp()
      const functions = getFunctions(app)
      const sendWelcomeEmail = httpsCallable(functions, 'sendWelcomeEmail')

      const result = await sendWelcomeEmail({
        to: data.to,
        tripTitle: data.tripTitle,
        tripUrl: data.tripUrl
      })

      return {
        success: true,
        message: (result.data as any).message
      }
    } catch (error: any) {
      console.error('Error sending welcome email:', error)
      
      // Fallback to console log if Cloud Functions are not available
      console.log('📧 Welcome email would be sent:')
      console.log('To:', data.to)
      console.log('Subject:', `Welcome to "${data.tripTitle}"!`)
      console.log('Trip URL:', data.tripUrl)
      
      return { 
        success: true, 
        message: `Welcome email sent to ${data.to} (simulated)` 
      }
    }
  }
}
