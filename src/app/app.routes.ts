import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FundsListComponent } from './pages/funds-list/funds-list.component';
import { TransactionHistoryComponent } from './pages/transaction-history/transaction-history.component';
import { LoginComponent } from './pages/login/login.component';
import { SubscriptionFormComponent } from './pages/subscription-form/subscription-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: 'funds', component: FundsListComponent },
      { path: 'transactions', component: TransactionHistoryComponent },
      { path: 'funds/subscribe/:id', component: SubscriptionFormComponent } // Nueva ruta con parámetro id
    ]
  }
];
