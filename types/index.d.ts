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

declare type User = {
    $id: string;
    email: string;
    userId: string;
    dwollaCustomerUrl: string;
    dwollaCustomerId: string;
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    dateOfBirth: string;
    ssn: string;
    action: string;
}

declare type SiderbarProps = {
    user: User;
}

declare type MobileNavProps = {
    user: User;
}

declare type RightSidebarProps = {
    user: User;
    banks: Account[];
}

declare type FooterProps = {
    user: User;
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
