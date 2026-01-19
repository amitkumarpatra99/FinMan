declare type HeaderBoxProps = {
    type?: "title" | "greeting";
    title: string;
    subtext: string;
    user?: string;
  };

declare type TotalBalanceBoxProps = {
    accounts: Account[];
    totalBanks: number;
    totalCurrentBalance: number;
}

declare type SiderbarProps = {
    user: any;
}

declare type DoughnutChartProps = {
    accounts: Account[];
}

declare type MobileNavProps = {
    user: any;
}

declare type Bank = {
    $id: string;
    accountId: string;
    bankId: string;
    accessToken: string;
    fundingSourceUrl: string;
    userId: string;
    shareableId: string;
}

declare type Transaction = {
    id: string;
    $id: string;
    name: string;
    paymentChannel: string;
    type: string;
    accountId: string;
    amount: number;
    pending: boolean;
    category: string;
    date: string;
    image: string;
}

declare type Account = {
    id: string;
    availableBalance: number;
    currentBalance: number;
    officialName: string;
    mask: string;
    institutionId: string;
    name: string;
    type: string;
    subtype: string;
    appwriteItemId: string;
    sharableId: string;
}

declare type CreditCardProps = {
    account: Account;
    userName: string;
    showBalance?: boolean;
}

declare type RightSidebarProps = {
    user: any;
    transactions: Transaction[];
    banks: Account[];
}

declare type FooterProps = {
    user: any;
    type?: 'mobile' | 'desktop';
}

declare type RecentTransactionsProps = {
    accounts: Account[];
    transactions: Transaction[];
    appwriteItemId: string;
    page: number;
    rowsPerPage?: number;
    enableSearch?: boolean;
    enablePagination?: boolean;
}
