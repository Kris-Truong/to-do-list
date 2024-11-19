import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Header from './Header';

describe('Header Component', () => {

    // Test for rendering the component
    it('should render header', () => {
        render(<Header />);
        expect(screen.getByText('To Do List')).toBeInTheDocument();
    });
});
