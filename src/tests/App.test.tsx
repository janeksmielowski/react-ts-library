import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders welcome text', () => {
    render(<App />);
    const linkElement = screen.getByText('Welcome to React TS template!');
    expect(linkElement).toBeInTheDocument();
});
