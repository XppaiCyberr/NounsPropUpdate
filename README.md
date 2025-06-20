# 🏛️ Nouns Proposals Web App

A modern web application for exploring Nouns DAO governance proposals with smart wallet newsletter subscription functionality.

## ✨ Features

- **📋 Proposal Dashboard**: View the latest 20 Nouns DAO proposals with detailed voting information
- **🗳️ Voting Analytics**: Visual representation of FOR/AGAINST/ABSTAIN votes with progress bars
- **📊 Live Statistics**: Real-time stats showing proposal counts, execution status, and voter participation
- **📧 Smart Newsletter**: Subscribe using your smart wallet profile email with secure verification
- **🎨 Modern UI**: Beautiful, responsive design built with Tailwind CSS
- **⚡ Real-time Data**: Fetches live data from the official Nouns API

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure email service** (see [SETUP.md](SETUP.md) for detailed instructions):
   ```bash
   # Create .env.local with your email credentials
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@nounsproposals.com
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** to see the app

## 🔧 Configuration

For detailed setup instructions including email configuration, smart wallet integration, and deployment, see [SETUP.md](SETUP.md).

## 🏗️ Architecture

- **Frontend**: Next.js 14 with React Server Components
- **Styling**: Tailwind CSS with custom components
- **Wallet Integration**: Wagmi with EIP-5792 capabilities
- **Email Service**: Nodemailer with Gmail/SendGrid support
- **Data Source**: Official Nouns API (api.nouns.biz)

## 📱 Smart Wallet Integration

This app leverages cutting-edge smart wallet technology to:
- Securely request user email addresses
- Verify wallet ownership through micro-transactions
- Prevent spam subscriptions
- Provide seamless user experience

## 🛡️ Security

- Email collection requires explicit user consent
- Smart wallet verification prevents unauthorized subscriptions
- Environment variables protect sensitive credentials
- HTTPS required for production deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ for the Nouns community • Powered by smart wallet profiles*
