import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { User } from './models/user';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'loaner-app';

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  users: User[] | undefined;
  selectedUser: User | undefined;

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'My data',
        icon: 'pi pi-fw pi-user',
        routerLink: 'my-data',
        state: this.selectedUser,
      },
      {
        label: 'Statistics',
        icon: 'pi pi-fw pi-chart-bar',
        routerLink: 'statistics',
        state: this.selectedUser,
      },
    ];

    // on every project launch and page refresh, transactions are emptied
    localStorage.setItem('allTransactions', JSON.stringify([]));

    this.activeItem = this.items[0];
    this.users = this.userService.getUsers();
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  onUserChange(event: User) {
    this.selectedUser = event;
    this.userService.activeUser = event;
  }
}
