import { GET, POST } from '../route';

describe('/api/teams', () => {
  const mockTeam = {
    name: 'Équipe Test',
    members: [{ id: 'm1', firstName: 'Jean', lastName: 'Dupont' }],
    assignedEquipment: ['push_mower'],
    defaultStartLocation: { lat: 48.8566, lng: 2.3522, address: 'Dépot central' },
    skills: ['mowing'],
    unavailableDates: [],
    workSchedule: {
      startTime: '08:00',
      endTime: '17:00',
      lunchBreakMinutes: 60,
      workingDays: [1, 2, 3, 4, 5],
    },
    color: '#22c55e',
  };

  describe('GET', () => {
    it('retourne la liste des équipes', async () => {
      const response = await GET();
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST', () => {
    it('cree une nouvelle équipe', async () => {
      const request = new Request('http://localhost/api/teams', {
        method: 'POST',
        body: JSON.stringify(mockTeam),
      });
      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('retourne 400 si body invalide', async () => {
      const request = new Request('http://localhost/api/teams', {
        method: 'POST',
        body: 'invalid json',
      });
      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
