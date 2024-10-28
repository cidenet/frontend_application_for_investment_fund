import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { GlobalStateService } from '../../services/global-state.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user: User | null = null;

  constructor(
    private globalStateService: GlobalStateService
  ) {}

  ngOnInit(): void {
    this.globalStateService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.globalStateService.clearUser();
  }
}
