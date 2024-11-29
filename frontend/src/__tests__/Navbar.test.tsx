import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

test('renders the Navbar component', () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  // Using getByRole to target the heading with the exact accessible name
  const heading = screen.getByRole('heading', { name: /Reco Sphere/i });
  expect(heading).toBeInTheDocument();
});
