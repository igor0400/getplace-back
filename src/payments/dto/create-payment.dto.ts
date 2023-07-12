export class CreatePaymentDto {
  readonly initialAmount: string;
  readonly discountProcent?: string;
  readonly currency: string;
}
