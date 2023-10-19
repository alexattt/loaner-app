export interface LoanTableModel {
  transactionId: number;
  userId: string;
  username: string;
  sentTimestamp: Date;
  paidOffTimestamp?: Date;
  amount: number;
  isActive: boolean;
}
