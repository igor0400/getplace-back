export class CreateUserDto {
  readonly password: string;
  readonly email: string;
  readonly emailVerify: boolean;
  readonly status: 'default' | 'cybersportsman' | 'premium' | 'celebrity';
  readonly iin: string;
  readonly phone: string;
}
