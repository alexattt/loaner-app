import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { Transaction } from '../models/transaction';
import { LoanTableModel } from '../models/loan-table-model';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(private userService: UsersService) {}

  // this is used for creating new loans
  addNewTransaction(sentFrom: string, sentTo: string, amountSent: number) {
    const retrievedTransactions = localStorage.getItem('allTransactions');

    let allTransactions: Transaction[] = [];

    if (retrievedTransactions !== null) {
      allTransactions = JSON.parse(retrievedTransactions);
    }

    allTransactions.push({
      id: allTransactions.length + 1,
      sentFrom: sentFrom,
      sentTo: sentTo,
      amountSent: amountSent,
      loanTimestamp: new Date(),
      isActive: true,
    } as Transaction);

    localStorage.setItem('allTransactions', JSON.stringify(allTransactions));

    // user which receives the loan gets loan amount and available money increase
    this.userService.updateUserLoanAmount(sentTo, amountSent);
    this.userService.updateUserAvailableMoney(sentTo, amountSent);

    // user which sends the loan gets lend amount increase, but available money decrease
    this.userService.updateUserLendAmount(sentFrom, amountSent);
    this.userService.updateUserAvailableMoney(sentFrom, -amountSent);
  }

  payOffLoan(transactionId: number) {
    const retrievedTransactions = localStorage.getItem('allTransactions');

    let allTransactions: Transaction[] = [];

    if (retrievedTransactions !== null) {
      allTransactions = JSON.parse(retrievedTransactions);
    }

    const transactionToUpdate = allTransactions.find(
      (transaction) => transaction.id === transactionId
    );

    if (!!transactionToUpdate) {
      const updatedTransaction = {
        id: transactionId,
        sentFrom: transactionToUpdate.sentFrom,
        sentTo: transactionToUpdate.sentTo,
        amountSent: transactionToUpdate.amountSent,
        loanTimestamp: transactionToUpdate.loanTimestamp,
        paidOffTimestamp: new Date(),
        isActive: false,
      };

      Object.assign(transactionToUpdate, updatedTransaction);

      localStorage.setItem('allTransactions', JSON.stringify(allTransactions));

      // user which got the loan and now pays it off gets loan amount and available money decrease
      this.userService.updateUserLoanAmount(
        transactionToUpdate.sentTo,
        -transactionToUpdate.amountSent
      );
      this.userService.updateUserAvailableMoney(
        transactionToUpdate.sentTo,
        -transactionToUpdate.amountSent
      );

      // user which gave the loan and now receives money back, gets lend amount decrease and available money increase
      this.userService.updateUserLendAmount(
        transactionToUpdate.sentFrom,
        -transactionToUpdate.amountSent
      );
      this.userService.updateUserAvailableMoney(
        transactionToUpdate.sentFrom,
        transactionToUpdate.amountSent
      );
    }
  }

  getAllUserTransactions(userId: string) {
    const retrievedTransactions = localStorage.getItem('allTransactions');

    let allTransactions: Transaction[] = [];

    if (retrievedTransactions !== null) {
      allTransactions = JSON.parse(retrievedTransactions);
    }

    const result = allTransactions.filter(
      (transaction) =>
        transaction.sentFrom === userId || transaction.sentTo === userId
    );

    return result;
  }

  getAllUserLoansReceived(userId: string) {
    const retrievedTransactions = localStorage.getItem('allTransactions');

    let allTransactions: Transaction[] = [];

    if (retrievedTransactions !== null) {
      allTransactions = JSON.parse(retrievedTransactions);
    }

    const transactions = allTransactions.filter(
      (transaction) => transaction.sentTo === userId
    );

    const result: LoanTableModel[] = [];

    transactions.forEach((transaction) => {
      const loanReceivedFrom: User | undefined = this.userService.getUserById(
        transaction.sentFrom
      );

      const tableModel: LoanTableModel = {
        transactionId: transaction.id,
        userId: loanReceivedFrom?.id ?? '',
        username: loanReceivedFrom?.username ?? '',
        sentTimestamp: transaction.loanTimestamp,
        paidOffTimestamp: transaction.paidOffTimestamp,
        amount: transaction.amountSent,
        isActive: transaction.isActive,
      };

      result.push(tableModel);
    });

    return result;
  }

  getAllUserLoansSent(userId: string): LoanTableModel[] {
    const retrievedTransactions = localStorage.getItem('allTransactions');

    let allTransactions: Transaction[] = [];

    if (retrievedTransactions !== null) {
      allTransactions = JSON.parse(retrievedTransactions);
    }

    const transactions = allTransactions.filter(
      (transaction) => transaction.sentFrom === userId
    );

    const result: LoanTableModel[] = [];

    transactions.forEach((transaction) => {
      const loanSentTo: User | undefined = this.userService.getUserById(
        transaction.sentTo
      );

      const tableModel: LoanTableModel = {
        transactionId: transaction.id,
        userId: loanSentTo?.id ?? '',
        username: loanSentTo?.username ?? '',
        sentTimestamp: transaction.loanTimestamp,
        paidOffTimestamp: transaction.paidOffTimestamp,
        amount: transaction.amountSent,
        isActive: transaction.isActive,
      };

      result.push(tableModel);
    });

    return result;
  }
}
