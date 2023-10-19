export interface Transaction {
  id: number;
  sentFrom: string;
  sentTo: string;
  amountSent: number;
  loanTimestamp: Date;
  paidOffTimestamp: Date | undefined;
  isActive: boolean;
}
