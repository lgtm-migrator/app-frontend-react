import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { ILandmarkShortcutsProps } from './LandmarkShortcuts';
import { LandmarkShortcuts } from './LandmarkShortcuts';

describe('LandmarkShortcuts.tsx', () => {
  it('should render supplied text', () => {
    renderMainContentNav();
    expect(screen.getByText('Hopp til hovedinnhold')).toBeInTheDocument();
  });

  it('should set active element to main when nav is clicked', async () => {
    renderMainContentNav();
    await userEvent.click(screen.getByRole('link'));
    expect(document.activeElement).toBe(document.getElementById('main-content'));
  });

  it('should reset tab index if this is changed by nav', async () => {
    renderMainContentNav({
      shortcuts: [{ text: 'Hopp til hovedinnhold', id: 'other-content' }],
    });
    await userEvent.click(screen.getByRole('link'));
    expect(document.getElementById('other-content')?.tabIndex).toBe(-2);
  });

  function renderMainContentNav(props: Partial<ILandmarkShortcutsProps> = {}) {
    const defaultProps: ILandmarkShortcutsProps = {
      shortcuts: [{ text: 'Hopp til hovedinnhold', id: 'main-content' }],
    };
    render(
      <>
        <LandmarkShortcuts
          {...defaultProps}
          {...props}
        />
        <main id='main-content'></main>
        <div
          id='other-content'
          tabIndex={-2}
        ></div>
      </>,
    );
  }
});
