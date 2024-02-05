import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders with className "App"', () => {
  render(<App />);
  const appElement = screen.getByTestId('app-container');
  expect(appElement)?.toHaveClass('App');
});
