// src/app/models/fund.model.ts
export interface Fund {
  _id: string;
  id: string;
  name: string;
  minimum_investment_amount: number;
  category: string;
  status: string | null;
  user_is_subscribed?: boolean;
  subscription_id_to_fund?: string
}
