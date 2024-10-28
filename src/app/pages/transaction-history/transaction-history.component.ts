import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FundsService } from '../../services/funds.service';
import { Router } from '@angular/router';
import { GlobalStateService } from '../../services/global-state.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
  transactions: any[] = [];
  user: User | null = null;
  isLoading = false;

  // paginate
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 0;

  constructor(
    private fundService: FundsService,
    private router: Router,
    private globalStateService: GlobalStateService
  ) { }


  get paginatedTransactions(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.transactions.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  ngOnInit(): void {
    this.globalStateService.user$.subscribe((user) => {
      this.user = user;
    });

    this.loadTransactions();
  }

  loadTransactions(): void {
    if (this.user) {
      this.isLoading = true;
      this.fundService.getTransactions(this.user?.id).subscribe({
        next: (data: any) => {
          this.transactions = data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          this.isLoading = false;
          this.totalPages = Math.ceil(this.transactions.length / this.itemsPerPage);
          console.log(">>> transactions :", this.transactions);
        },
        error: (error: any) => {
          console.error(error);
          this.isLoading = false;
        }
      });
    }
  }

  goBackToFundList(): void {
    this.router.navigate(['/dashboard/funds']);
  }
}
