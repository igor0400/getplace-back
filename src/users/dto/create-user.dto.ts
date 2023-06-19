import { StatusTypes } from "../types/status-types";

export class CreateUserDto {
  readonly password: string;
  readonly email: string;
  readonly emailVerify: boolean;
  readonly status: StatusTypes;
  readonly iin: string;
  readonly phone: string;
}
