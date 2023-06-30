import { Periods } from './periods';

export interface GetAllItemsGuestsValues {
  period: Periods;
  employeeId: string;
  limit?: number;
  offset?: number;
}

export interface GetItemGuestsValues {
  period: Periods;
  itemId: string;
  limit?: number;
  offset?: number;
}
