import ApiResponse from '@/interfaces/api-service.interface';
import { ClientUser, Permissions } from '@/interfaces/users.interface';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

// export class Permissions implements IPermissions {
//   @IsBoolean()
//   canEditSystemMessages: boolean;
// }

export class User implements ClientUser {
  @IsString()
  name: string;
  @IsString()
  username: string;
  @IsString()
  givenName: string;
  @IsString()
  surname: string;
  @IsString()
  groups: string;
  @Type(() => Permissions)
  permissions: Permissions;
  // @IsEnum(InternalRoleEnum)
  // role: InternalRole;
  // @ValidateNested()
  // @Type(() => Permissions)
  // permissions: Permissions;
}

export class UserApiResponse implements ApiResponse<User> {
  @ValidateNested()
  @Type(() => User)
  data: User;
  @IsString()
  message: string;
}
