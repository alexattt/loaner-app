import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/models/user';
import { TransactionsService } from 'src/app/services/transactions.service';
import { UsersService } from 'src/app/services/users.service';
import { LoanTableModel } from 'src/app/models/loan-table-model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit {
  datepipe: DatePipe = new DatePipe('en-US');

  currentActiveUser: User | undefined;
  allUsers: User[] = [{} as User];

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  userLoansSent: any;
  userLoansReceived: any;

  formGroup: FormGroup = new FormGroup({});

  constructor(
    private userService: UsersService,
    private transactionService: TransactionsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.userService.activeUser.subscribe((nextValue: User) => {
      this.currentActiveUser = nextValue;
      this.fetchLoanData();
      this.fetchUsers();
    });
  }

  fetchUsers() {
    this.allUsers = [{} as User];

    const users = this.userService
      .getUsers()
      .filter((user) => user.id !== this.currentActiveUser?.id);

    this.allUsers = this.allUsers.concat(users);
  }

  fetchLoanData() {
    this.userLoansSent = this.transactionService.getAllUserLoansSent(
      this.currentActiveUser?.id ?? ''
    );

    this.userLoansReceived = this.transactionService.getAllUserLoansReceived(
      this.currentActiveUser?.id ?? ''
    );
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Loans to pay off',
        icon: 'pi pi-fw pi-user',
      },
      {
        label: 'Loans I sent',
        icon: 'pi pi-fw pi-chart-bar',
      },
    ];

    this.formGroup = new FormGroup({
      sentTo: new FormControl<string | null>(null),
      amountToSend: new FormControl<number | null>(null),
    });

    this.fetchUsers();
    this.fetchLoanData();
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  payBackLoan(event: any, loanToPayBack: LoanTableModel) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to pay back this loan?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (
          (this.currentActiveUser?.availableMoney ?? 0) >= loanToPayBack.amount
        ) {
          this.transactionService.payOffLoan(loanToPayBack.transactionId);

          this.fetchLoanData();

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'You have paid back the loan!',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Fail',
            detail: 'You do not have enough resources to pay back this loan.',
          });
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancel',
          detail: 'You have not paid back this loan.',
        });
      },
    });
  }

  sendLoan(event: any) {
    const sendToUserUsername =
      this.formGroup.controls['sentTo'].value?.['username'];
    const sendToUserId = this.formGroup.controls['sentTo'].value?.['id'];
    const amountToSend = this.formGroup.controls['amountToSend'].value;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Please confirm sending this loan',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (
          (this.currentActiveUser?.availableMoney ?? 0) >= amountToSend &&
          !!sendToUserId &&
          !!amountToSend
        ) {
          this.transactionService.addNewTransaction(
            this.currentActiveUser?.id ?? '',
            sendToUserId,
            amountToSend
          );

          this.fetchLoanData();
          this.formGroup.reset();

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `You have sent the loan ${sendToUserUsername}!`,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Fail',
            detail:
              'Transaction failed. Please check the input fields and make sure you have enough money.',
          });
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancel',
          detail: 'You have not paid back this loan.',
        });
      },
    });
  }
}
