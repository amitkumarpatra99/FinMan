# FINMAN - Financial Management Application

![FINMAN Project](/public/project.png)

FINMAN is a modern, responsive financial management dashboard built with Next.js. It helps users track their multiple bank accounts, view transaction history, and transfer funds seamlessly..

## Key Features

- **Dashboard Overview**: View total balance, recent transactions, and connected banks at a glance.
- **Bank Management**:
    - **Add Bank**: Easily link new bank accounts to your profile.
    - **Edit Bank**: Update the display name of your banks.
    - **Delete Bank**: Remove unused or closed bank accounts from your dashboard.
- **Profile Customization**:
    - **Edit Profile**: Update your First Name, Last Name, and Email directly from the dashboard.
    - Updates are reflected instantly across the application (e.g., Bank Cards, Welcome Message).
- **Financial Tools**:
    - **Transfer Funds**: Move money between your connected accounts.
    - **Transaction History**: Detailed list of your recent spending and income.
        - **Search**: Quickly find transactions by keyword.
        - **Pagination**: Navigate through large lists of transactions easily.
    - **Budgeting**: (New) Track your expenses against set limits for different categories.
- **Currency Support**: Fully localized for Indian Rupees (₹).
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices (including complex layouts like Charts and Tables).

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **State Management**: React Context API
- **Form Handling**: React Hook Form (or Standard React Forms)
- **Icons**: Lucide React & Custom SVGs

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
