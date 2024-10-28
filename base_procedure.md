## frontend_application_for_investment_fund

- instalar angular CLI
npm install -g @angular/cli

## CREANDO NUEVO PROYECTO
ng new investment-fund-app
cd investment-fund-app

npm install bootstrap@5 sweetalert2
ng generate component components/header
ng generate component components/sidebar
ng generate component components/dashboard
ng generate component pages/login
ng generate component pages/funds-list
ng generate component pages/transaction-history
ng generate component pages/subscription-form
ng generate service services/funds

- estado global:
ng generate service services/global-state



# INSTALAR DEPENDENCIAS Y CORRER EL PROYECTO
npm install
ng serve

# instalar bootstrap icons
npm install bootstrap-icons