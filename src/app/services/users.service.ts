import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // list of dummy users which we can use to test transaction logic
  private users: User[] = [
    {
      id: 'f5362ed2-a8ef-469f-848e-8057bfdc1bb9',
      username: 'John Doe',
      availableMoney: 300,
      currentLoanAmount: 0,
      currentLendAmount: 0,
    },
    {
      id: '3eb712ae-e003-4b64-bfdd-e2841be666ed',
      username: 'Sara Smith',
      availableMoney: 500,
      currentLoanAmount: 0,
      currentLendAmount: 0,
    },
    {
      id: '4ab7b7fe-3213-4720-90a9-b5af6d128660',
      username: 'Jānis Bērziņš',
      availableMoney: 50,
      currentLoanAmount: 0,
      currentLendAmount: 0,
    },
    {
      id: '8230b2e1-8b09-4a8f-a3ad-eabb232a3713',
      username: 'Līga Liepiņa',
      availableMoney: 100,
      currentLoanAmount: 0,
      currentLendAmount: 0,
    },
  ];

  currentUserValue = new BehaviorSubject<User>(this.activeUser);

  constructor() {}

  getUsers() {
    return this.users;
  }

  set activeUser(user: any) {
    this.currentUserValue.next(user);
    localStorage.setItem('activeUser', JSON.stringify(user));
  }

  get activeUser() {
    return this.currentUserValue?.asObservable();
  }

  getUserById(id: string) {
    const user = this.users.find((user) => user.id === id);

    return user;
  }

  updateUserAvailableMoney(id: string, amount: number) {
    const user = this.users.find((user) => user.id === id);

    if (!!user) {
      user.availableMoney += amount;
    }
  }

  updateUserLoanAmount(id: string, amount: number) {
    const user = this.users.find((user) => user.id === id);

    if (!!user) {
      user.currentLoanAmount += amount;
    }
  }

  updateUserLendAmount(id: string, amount: number) {
    const user = this.users.find((user) => user.id === id);

    if (!!user) {
      user.currentLendAmount += amount;
    }
  }

  // since property currentLoanAmount is updated during all and any transactions
  // we can safely use it as an up to date indicator about the loan amount user currently has to pay back
  getUsersWithMostLoansReceivedCurrently() {
    return this.users
      .sort((a, b) => b.currentLoanAmount - a.currentLoanAmount)
      .slice(0, 3);
  }

  // since property currentLoanAmount is updated during all and any transactions
  // we can safely use it as an up to date indicator about the loan amount the user has currently sent and not yet received bacl
  getUsersWithMostLoansSentCurrently() {
    return this.users
      .sort((a, b) => b.currentLendAmount - a.currentLendAmount)
      .slice(0, 3);
  }
}
