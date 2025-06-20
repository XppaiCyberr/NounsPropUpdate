# Nouns Proposals Web App Setup

## Overview
This is a Next.js web application that displays Nouns DAO proposals and allows users to subscribe to a newsletter using their smart wallet profile email.

## Features
- 📋 Display latest 20 Nouns DAO proposals
- 🗳️ Show voting results and status for each proposal
- 📧 Newsletter subscription using smart wallet profiles
- 📊 Dashboard with proposal statistics
- 🎨 Modern, responsive UI with Tailwind CSS

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email Service (SMTP)
Create a `.env.local` file in the root directory with your SMTP configuration:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

#### Gmail Setup (Recommended for Development):
1. Go to your Google Account settings
2. Select Security → 2-Step Verification (must be enabled)
3. Under "Signing in to Google," select App passwords
4. Generate a new app password for this application
5. Use your Gmail address for `EMAIL_USER` and the app password for `EMAIL_PASS`

#### Other SMTP Providers:

**Hostinger:**
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-email-password
```

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-email-password
```

**SendGrid (Production Recommended):**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### 3. Update Callback URL
In both `src/app/page.tsx` and `src/components/NewsletterSubscription.tsx`, update the callback URL to match your deployment:

```javascript
function getCallbackURL() {
  return "YOUR_DEPLOYED_URL/api/data-validation";
}
```

### 4. Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## How It Works

### Proposal Display
- Fetches data from the Nouns API (`https://api.nouns.biz/proposal/{id}`)
- Displays proposals 791-810 (latest 20 proposals)
- Shows voting results, status, and proposal details

### Newsletter Subscription
1. User clicks "Subscribe Now" button
2. Smart wallet prompts for email permission
3. Small USDC transaction (0.001) verifies wallet ownership
4. Email is extracted from smart wallet profile
5. Confirmation email is sent via nodemailer
6. User receives welcome email with subscription confirmation

### Smart Wallet Integration
- Uses Wagmi for wallet connections
- Leverages EIP-5792 capabilities for data requests
- Secure email extraction from verified smart wallet profiles

## API Endpoints

### `/api/newsletter` (POST)
Handles newsletter subscriptions and sends confirmation emails.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Newsletter subscription confirmed! Check your email."
}
```

### `/api/data-validation` (POST)
Validates smart wallet profile data (existing endpoint).

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
Ensure you:
1. Set environment variables for email configuration
2. Update callback URLs to match your domain
3. Configure CORS if needed

## Security Notes

- Email addresses are only collected with user consent
- Smart wallet verification prevents spam subscriptions
- Environment variables keep email credentials secure
- HTTPS required for production (smart wallet requirement)

## Customization

### Adding More Proposals
Update the range in `src/app/page.tsx`:
```javascript
// Fetch proposals 700-810 (111 proposals)
for (let i = 810; i >= 700; i--) {
  // ...
}
```

### Styling
- Uses Tailwind CSS for styling
- Modify `tailwind.config.js` for theme customization
- Update `src/app/globals.css` for global styles

### Email Templates
Customize the email template in `src/app/api/newsletter/route.ts` in the `mailOptions.html` section.

## Troubleshooting

### Email Not Sending
- Check environment variables are set correctly
- Verify Gmail app password or SendGrid API key
- Check console logs for detailed error messages

### Smart Wallet Issues
- Ensure callback URL is accessible and correct
- Verify HTTPS in production
- Check wallet connection and permissions

### Proposal Data Not Loading
- Verify Nouns API is accessible
- Check console for API errors
- Ensure proposal IDs exist

## Contributing
Feel free to submit issues and pull requests to improve the application! 