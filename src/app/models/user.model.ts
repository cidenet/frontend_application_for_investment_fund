// src/app/models/user.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  investment_capital: number;
  investment_fund_value?: number;
  phone_number: string;
}
