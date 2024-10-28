import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para usar ngModel
import { FundsService } from '../../services/funds.service';
import { User } from '../../models/user.model'; // Importa la interfaz User
import { GlobalStateService } from '../../services/global-state.service';
import Swal from 'sweetalert2';
// import { GlobalStateService } from '../../services/global-state.service'; // Importa el servicio de estado global

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Agrega FormsModule a los imports
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(
    private fundService: FundsService,
    private router: Router,
    private globalStateService: GlobalStateService
  ) {}

  ngOnInit() {
    this.fundService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  login() {
    if (this.selectedUser) {
      // Guarda el usuario seleccionado en el estado global
      // this.globalState.setUser(this.selectedUser);
      // Simula el inicio de sesión y redirige a la lista de fondos
      // Suponemos que la autenticación fue exitosa y tenemos el usuario
      this.globalStateService.setUser(this.selectedUser);

      this.router.navigate(['/dashboard/funds']);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario no seleccionado',
        text: 'Por favor, seleccione un usuario.',
      });
    }
  }
}
