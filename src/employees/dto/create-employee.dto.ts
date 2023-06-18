export class CreateEmployeeDto {
  readonly password: string;
  readonly email: string;
  readonly emailVerify: boolean;
  readonly iin: string;
  readonly phone: string;
  readonly name: string;
}
