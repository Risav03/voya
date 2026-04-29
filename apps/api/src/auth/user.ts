import { coreRepository } from '../services/repository';

export interface AuthUserLike {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  imageUrl?: string | null;
}

export async function ensureDomainUser(user: AuthUserLike) {
  return coreRepository.ensureUser({
    id: user.id,
    email: user.email,
    name: user.name,
    imageUrl: user.imageUrl ?? user.image,
  });
}
