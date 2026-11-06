export interface AuthUser {
  username: string
  isLoggedIn: boolean
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export interface LoginFormValues {
  username: string
  password: string
}

/** The editable part of the profile: AuthUser's optional fields, all required in the form. */
export type ProfileFormValues = Required<Pick<AuthUser, 'firstName' | 'lastName' | 'email' | 'phone'>>
