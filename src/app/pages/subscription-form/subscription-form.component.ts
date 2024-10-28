import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FundsService } from '../../services/funds.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { GlobalStateService } from '../../services/global-state.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.scss'
})
export class SubscriptionFormComponent {
  subscriptionForm: FormGroup;
  fundId: string | null = null;
  user: User | null = null;
  minimumInvestmentAmount: number | null = null;
  fundName: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private fundService: FundsService,
    private route: ActivatedRoute,
    private router: Router,
    private globalStateService: GlobalStateService
  ) {
    this.subscriptionForm = this.fb.group({
      user_id: this.user?.id,
      fund_id: this.fundId,
      subscription_notification_channel: ['', Validators.required],
      status: 'active'
    });
  }

  ngOnInit(): void {
    this.fundId = this.route.snapshot.paramMap.get('id');
    this.globalStateService.user$.subscribe((user) => {
      this.user = user;

      if (this.user) {
        this.subscriptionForm.patchValue({
          user_id: this.user.id,
          fund_id: this.fundId
        });
      }
    });

    this.route.queryParams.subscribe(params => {
      this.minimumInvestmentAmount = params['minimum_investment_amount'];
      this.fundName = params['fund_name'];
    });
  }

  submitSubscription() {
    if (!this.subscriptionForm.get('subscription_notification_channel')?.value) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debe seleccionar un medio de notificación.',
      });
      return;
    }

    if (this.subscriptionForm.valid) {
      console.log(this.subscriptionForm.value);
      Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea realizar la suscripción al fondo?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, suscribirme',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
            this.isLoading = true; // Show the loader while the subscription is being processed

          this.fundService.createSubscription(this.subscriptionForm.value).subscribe(
            response => {
              Swal.fire(
                'Suscripción realizada',
                response.detail ? response.detail : 'Se ha suscrito al fondo exitosamente.',
                'success'
              );

                // Update the user's available capital
              if (this.user && this.minimumInvestmentAmount) {
                const newCapital = response.new_capital_value;
                this.globalStateService.updateUserCapital(newCapital);
              }

              this.subscriptionForm.reset();

              this.isLoading = false;
            },
            error => {
              Swal.fire(
                'Error',
                error,
                'error'
              );

              this.isLoading = false;
            }
          );
        } else {
          this.isLoading = false;
        }
      });
    }
  }

  goBackToFundList(): void {
    this.router.navigate(['/dashboard/funds']);
  }
}
