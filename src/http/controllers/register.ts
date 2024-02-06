import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/libs/prisma'
import { z } from 'zod'
import { hash } from 'bcryptjs'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userAlreadyExists) {
    return reply.status(409).send()
  }

  const hashedPassword = await hash(password, 6)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: hashedPassword,
    },
  })

  return reply.status(201).send()
}
