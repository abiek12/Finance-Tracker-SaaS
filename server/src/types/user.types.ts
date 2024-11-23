export interface UserResponseDto {
  id: string;
  userName: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLoginData {
    email: string;
    password: string;
}

export interface UserRegData extends UserLoginData {
    userName: string;
    phone: string;
}

export interface userLoginResponse {
    userResponse: UserResponseDto;
    accessToken: string;
    refreshToken: string;
}