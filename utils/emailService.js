const sgMail = require('@sendgrid/mail');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  static async sendVerificationEmail(email, name, token) {
    const verificationUrl = `${process.env.SITE_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    const setupUrl = `${process.env.SITE_URL}/complete-setup?token=${token}&email=${encodeURIComponent(email)}`;
    
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Welcome to Luxury Perfumes - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Luxury Perfumes</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome to the world of luxury fragrances</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${name},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for choosing Luxury Perfumes! To complete your account setup and start enjoying our premium collection, please verify your email address.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you placed an order as a guest, you can also set up your permanent password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${setupUrl}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Complete Account Setup
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If the buttons above don't work, you can copy and paste these links into your browser:
            </p>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                <strong>Verify Email:</strong><br>
                <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
              </p>
            </div>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                <strong>Complete Setup:</strong><br>
                <a href="${setupUrl}" style="color: #28a745;">${setupUrl}</a>
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This verification link will expire in 1 hour for security reasons.
            </p>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              If you didn't create an account with Luxury Perfumes, you can safely ignore this email.
            </p>
          </div>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.error('SendGrid error:', error);
      return false;
    }
  }

  static async sendOrderConfirmation(email, name, orderNumber, orderDetails) {
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Luxury Perfumes</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Order Confirmation</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for your order, ${name}!</h2>
            
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Order Details</h3>
              <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
              <p style="margin: 5px 0;"><strong>Total Amount:</strong> $${orderDetails.totalAmount}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> ${orderDetails.status}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We're processing your order and will send you updates as it progresses. You can track your order status in your account dashboard.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.SITE_URL}/orders" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                View Order Status
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              If you have any questions, please contact our customer support.
            </p>
          </div>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.error('SendGrid error:', error);
      return false;
    }
  }
}

module.exports = EmailService;
