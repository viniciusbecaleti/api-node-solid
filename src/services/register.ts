import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { prisma } from '@/libs/prisma'
import { hash } from 'bcryptjs'

interface RegisterServiceProps {
  name: string
  email: string
  password: string
}

export async function registerService({
  name,
  email,
  password,
}: RegisterServiceProps) {
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userAlreadyExists) {
    throw new Error('User already exists')
  }

  const hashedPassword = await hash(password, 6)

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    name,
    email,
    password_hash: hashedPassword,
  })
}
