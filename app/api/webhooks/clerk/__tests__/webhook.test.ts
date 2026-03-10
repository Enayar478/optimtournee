/**
 * Tests unitaires — /api/webhooks/clerk
 * Mocks: svix (Webhook.verify), next/headers, @/lib/prisma
 */

const mockVerify = jest.fn()
const mockUserCreate = jest.fn()
const mockUserUpsert = jest.fn()
const mockUserDelete = jest.fn()
const mockHeaders = jest.fn()

jest.mock('svix', () => ({
  Webhook: jest.fn().mockImplementation(() => ({
    verify: mockVerify,
  })),
}))

jest.mock('next/headers', () => ({
  headers: () => mockHeaders(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      create: (...args: unknown[]) => mockUserCreate(...args),
      upsert: (...args: unknown[]) => mockUserUpsert(...args),
      delete: (...args: unknown[]) => mockUserDelete(...args),
    },
  },
}))

import { POST } from '../route'

const SVIX_HEADERS = {
  'svix-id': 'msg_test123',
  'svix-timestamp': '1700000000',
  'svix-signature': 'v1,test_signature',
}

const makeWebhookRequest = (body: unknown) =>
  new Request('http://localhost/api/webhooks/clerk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

const buildHeaderMap = (overrides: Partial<Record<string, string>> = {}) => {
  const hdrs = { ...SVIX_HEADERS, ...overrides }
  return {
    get: (key: string) => hdrs[key as keyof typeof hdrs] ?? null,
  }
}

describe('/api/webhooks/clerk POST', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv, CLERK_WEBHOOK_SECRET: 'whsec_test_secret' }
    mockHeaders.mockReturnValue(buildHeaderMap())
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('retourne 500 si CLERK_WEBHOOK_SECRET manquant', async () => {
    delete process.env.CLERK_WEBHOOK_SECRET
    const req = makeWebhookRequest({ type: 'user.created', data: {} })
    const response = await POST(req)
    expect(response.status).toBe(500)
  })

  it('retourne 400 si svix headers manquants', async () => {
    mockHeaders.mockReturnValue({ get: () => null })
    const req = makeWebhookRequest({ type: 'user.created', data: {} })
    const response = await POST(req)
    expect(response.status).toBe(400)
  })

  it('retourne 400 si signature invalide', async () => {
    mockVerify.mockImplementation(() => { throw new Error('Invalid signature') })
    const req = makeWebhookRequest({ type: 'user.created', data: {} })
    const response = await POST(req)
    expect(response.status).toBe(400)
  })

  it('traite user.created — crée un utilisateur en DB', async () => {
    const payload = {
      type: 'user.created',
      data: {
        id: 'clerk_user_abc',
        email_addresses: [{ email_address: 'alice@example.com' }],
        first_name: 'Alice',
        last_name: 'Dupont',
      },
    }
    mockVerify.mockReturnValue(payload)
    mockUserCreate.mockResolvedValue({ id: 'db_u1', clerkId: 'clerk_user_abc' })

    const req = makeWebhookRequest(payload)
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
    expect(mockUserCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ clerkId: 'clerk_user_abc', email: 'alice@example.com', name: 'Alice Dupont' }),
      })
    )
  })

  it('traite user.updated — upsert utilisateur en DB', async () => {
    const payload = {
      type: 'user.updated',
      data: {
        id: 'clerk_user_abc',
        email_addresses: [{ email_address: 'alice.new@example.com' }],
        first_name: 'Alice',
        last_name: 'Martin',
      },
    }
    mockVerify.mockReturnValue(payload)
    mockUserUpsert.mockResolvedValue({ id: 'db_u1' })

    const req = makeWebhookRequest(payload)
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
    expect(mockUserUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { clerkId: 'clerk_user_abc' },
        update: { email: 'alice.new@example.com', name: 'Alice Martin' },
      })
    )
  })

  it('traite user.deleted — supprime utilisateur en DB', async () => {
    const payload = {
      type: 'user.deleted',
      data: { id: 'clerk_user_abc' },
    }
    mockVerify.mockReturnValue(payload)
    mockUserDelete.mockResolvedValue({ id: 'db_u1' })

    const req = makeWebhookRequest(payload)
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
    expect(mockUserDelete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { clerkId: 'clerk_user_abc' } })
    )
  })

  it('traite user.deleted sans id — ne supprime rien', async () => {
    const payload = { type: 'user.deleted', data: {} }
    mockVerify.mockReturnValue(payload)

    const req = makeWebhookRequest(payload)
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
    expect(mockUserDelete).not.toHaveBeenCalled()
  })

  it('retourne received: true pour un event type inconnu', async () => {
    const payload = { type: 'session.created', data: { id: 'sess_abc' } }
    mockVerify.mockReturnValue(payload)

    const req = makeWebhookRequest(payload)
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
  })
})
