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

declare type DoughnutChartProps = {
    accounts: Account[];
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

declare type signInProps = {
  email: string;
  password: string;
}

declare type SignUpParams = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  password: string;
}
