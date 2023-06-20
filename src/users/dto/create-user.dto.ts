export class CreateUserDto {
  readonly password: string;
  readonly email: string;
  readonly emailVerify: boolean;
  readonly iin: string;
  readonly phone: string;
}
