import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface RegisterServiceProps {
  name: string
  email: string
  password: string
}

interface RegisterServiceResponse {
  user: User
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async handle({ name, email, password }: RegisterServiceProps): Promise<RegisterServiceResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    const hashedPassword = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: hashedPassword,
    })

    return {
      user
    }
  }
}
