import { render, screen } from '@testing-library/react';
import OpenStreetMap from '../OpenStreetMap';
import { Client } from '@/types/domain';

describe('OpenStreetMap', () => {
  const mockClients: Client[] = [
    {
      id: 'c1',
      name: 'Client A',
      location: { lat: 48.8566, lng: 2.3522, address: 'Paris' },
    },
    {
      id: 'c2',
      name: 'Client B',
      location: { lat: 48.8576, lng: 2.3532, address: 'Lion' },
    },
  ];

  it('renders les marqueurs sur la carte', () => {
    render(<OpenStreetMap clients={mockClients} />);
    
    expect(screen.getByRoleLabel('map')).toBeInHeDocument();
  });

  it('appel le masque "OpenStreetMap" dans le role', () => {
    render(<OpenStreetMap clients={mockClients} />);
    
    const mapElement = screen.getByRoleLabel('map');
    expect(mapElement).toHaveAttribute('data-testid', 'open-street-map');
  });
});
