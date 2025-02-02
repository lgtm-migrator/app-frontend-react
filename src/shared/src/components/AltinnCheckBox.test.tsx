import * as React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event';
import { createTheme, MuiThemeProvider } from '@material-ui/core';

import AltinnCheckBoxComponent from './AltinnCheckBox';
import { AltinnAppTheme } from '../theme';

const render = (props = {}) => {
  const allProps = {
    checked: false,
    ...props,
  };
  const theme = createTheme(AltinnAppTheme);

  rtlRender(
    <MuiThemeProvider theme={theme}>
      <AltinnCheckBoxComponent {...allProps} />
    </MuiThemeProvider>,
  );
};

describe('AltinnCheckBox', () => {
  it('should call change handler when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render({ onChangeFunction: handleChange });

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalled();
  });

  it('should not call change handler when clicked and disabled is true', async () => {
    const user = userEvent.setup({
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });
    const handleChange = jest.fn();
    render({ onChangeFunction: handleChange, disabled: true });

    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should call change handler when focused with tab and enter is hit', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render({ onKeyPressFunction: handleChange });

    await user.tab();
    await user.keyboard('{enter}');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should not call change handler when focused with tab and enter is hit, when disabled is true', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render({ onKeyPressFunction: handleChange, disabled: true });

    await user.tab();
    await user.keyboard('{enter}');

    expect(handleChange).not.toHaveBeenCalled();
  });
});
