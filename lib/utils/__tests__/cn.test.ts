import { cn } from '../cn';

describe('cn utility', () => {
  it('combine classes', () => {
    expect(cn('text-red', 'bold')).toBe('text-red bold');
  });
});
