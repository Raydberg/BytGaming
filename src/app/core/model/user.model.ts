export interface UserModel {
  id:                  number;
  name:                null | string;
  lastName:            null | string;
  email:               string;
  accountNoExpired:    boolean;
  accountNoLocked:     boolean;
  credentialNoExpired: boolean;
  role:                Role;
  enabled:             boolean;
}

export interface Role {
  id:       number;
  roleEnum: string;
}

