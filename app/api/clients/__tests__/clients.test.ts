import { GET, POST } from '../route';

describe('/api/clients', () => {
  const mockClient = {
    name: 'Test Client',
    location: { lat: 48.8566, lng: 2.3522, address: '123 Test Street, Paris' },
    contactPhone: '06 12 34 56 78',
    contactEmail: 'test@example.com',
    notes: 'Test notes',
  };

  describe('GET', () => {
    it('retourne la liste des clients', async () => {
      const response = await GET();
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST', () => {
    it('cree un nouveau client', async () => {
      const request = new Request('http://localhost/api/clients', {
        method: 'POST',
        body: JSON.stringify(mockClient),
      });
      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('retourne 400 si body invalide', async () => {
      const request = new Request('http://localhost/api/clients', {
        method: 'POST',
        body: 'invalid json',
      });
      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
