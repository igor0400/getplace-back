export class CreatePaymentDto {
  readonly initialAmount: string;
  readonly discount?: string;
  readonly currency: string;
}
