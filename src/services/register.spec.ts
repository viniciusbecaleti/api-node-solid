import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('register use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(inMemoryUsersRepository)
  })

  it('should hash the user password upon registration', async () => {
    const { user } = await sut.handle({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to register with email already in use', async () => {
    const email = 'john@doe.com'

    await sut.handle({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.handle({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register a user', async () => {
    const email = 'john@doe.com'

    const { user } = await sut.handle({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
