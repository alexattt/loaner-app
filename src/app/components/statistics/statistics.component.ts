import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  topLoanReceivers: User[] = [];
  topLoanSenders: User[] = [];

  constructor(private userService: UsersService) {}

  fetchTopUserData() {
    this.topLoanReceivers =
      this.userService.getUsersWithMostLoansReceivedCurrently();
    this.topLoanSenders = this.userService.getUsersWithMostLoansSentCurrently();
  }

  ngOnInit() {
    this.fetchTopUserData();
  }
}
