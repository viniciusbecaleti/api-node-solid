import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository';
import { describe, expect, it } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('register use case', () => {
  it('should hash the user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const { user } = await registerService.handle({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456'
    })

    const isPasswordHashed = await compare('123456', user.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to register with email already in use', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const email = 'john@doe.com'

    await registerService.handle({
      name: 'John Doe',
      email,
      password: '123456'
    })

    await expect(() => registerService.handle({
      name: 'John Doe',
      email,
      password: '123456'
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register a user', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const email = 'john@doe.com'

    const { user } = await registerService.handle({
      name: 'John Doe',
      email,
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
