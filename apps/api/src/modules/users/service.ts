export class UsersService {
  getMe(domainUser: unknown, session: unknown) {
    return { user: domainUser, session };
  }
}
export const usersService = new UsersService();
