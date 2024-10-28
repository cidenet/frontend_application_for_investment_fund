import { Component } from '@angular/core';
import { FundsService } from '../../services/funds.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Fund } from '../../models/fund.model';
import { GlobalStateService } from '../../services/global-state.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funds-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './funds-list.component.html',
  styleUrls: ['./funds-list.component.scss'],
})
export class FundsListComponent {
  funds: Fund[] = [];
  user: User | null = null;
  isLoading = false; // Propiedad para controlar el estado de carga


  constructor(
    private fundService: FundsService,
    private router: Router,
    private globalStateService: GlobalStateService
  ) { }

  ngOnInit() {
    this.globalStateService.user$.subscribe((user) => {
      this.user = user;
    });

    this.updateFundsList();
  }

  updateFundsList() {
    if (this.user) {
      this.isLoading = true;
      this.fundService.getFunds(this.user.id).subscribe((funds: Fund[]) => {
        this.funds = funds;
        this.isLoading = false;
        console.log(">>> funds with status subscribe by user :", this.funds);
      });
    }
  }

  subscribeToFund(fund: Fund) {
    this.router.navigate(['/dashboard/funds/subscribe', fund.id], {
      queryParams: {
        minimum_investment_amount: fund.minimum_investment_amount,
        fund_name: fund.name
      }
    });
  }

  confirmUnsubscribe(fund: Fund) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a cancelar tu suscripción al fondo ${fund.name}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener suscripción'
    }).then((result) => {
      if (result.isConfirmed) {
        this.fundService.cancelSubscription(fund.subscription_id_to_fund).subscribe((response) => {
          Swal.fire(
            'Cancelado',
            response.detail ? response.detail : 'Tu suscripción ha sido cancelada.',
            'success'
          );

          // Update the user's available capital
          if (this.user) {
            const newCapital = response.new_capital_value;
            this.globalStateService.updateUserCapital(newCapital);
          }

          this.updateFundsList();
        });
      }
    });
  }
}
