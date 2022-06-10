import React from 'react';
import { screen } from '@testing-library/react';
import { getPanelTitle, ISoftValidationProps, SoftValidations, SoftValidationVariant } from './SoftValidations';
import { renderWithProviders } from 'src/../testUtils';
import { getInitialStateMock } from 'src/../__mocks__/initialStateMock';
import { nb } from 'altinn-shared/language/texts/nb';
import type { IRuntimeState, ITextResource } from 'src/types';
import { FormComponentContext } from 'src/components';
import type { IFormComponentContext} from 'src/components';

const render = (
  props: Partial<ISoftValidationProps> = {},
  suppliedState: Partial<IRuntimeState> = {},
  suppliedContext: Partial<IFormComponentContext> = {}
) => {
  const allProps: ISoftValidationProps = {
    variant: 'info',
    children: <ol><li>Some message</li></ol>,
    ...props,
  };

  renderWithProviders(
    <FormComponentContext.Provider value={suppliedContext}>
      <SoftValidations {...allProps} />
    </FormComponentContext.Provider>, {
    preloadedState: {
      ...getInitialStateMock(),
      ...suppliedState
    }
  });
};

describe('SoftValidations', () => {
  it.each(['info', 'warning', 'success'])('for variant %p it should render the message with correct title', (variant: SoftValidationVariant) => {
    render({ variant });

    const message = screen.getByText('Some message');
    expect(message).toBeInTheDocument();

    const title = screen.getByText(getPanelTitle({ variant, textResources: [], language: nb() }));
    expect(title).toBeInTheDocument();
  });

  it.each(['info', 'warning', 'success'])('for variant %p it should render the message with overridden title if supplied by app', (variant: SoftValidationVariant) => {
    const suppliedTextResources: ITextResource[] = [
      { id: 'soft_validation.warning_title', value: 'Overridden warning title' },
      { id: 'soft_validation.info_title', value: 'Overridden info title' },
      { id: 'soft_validation.success_title', value: 'Overridden success title' },
    ];
    render({ variant }, {
      textResources: {
        language: 'nb',
        resources: suppliedTextResources,
        error: null
      }
    });

    const message = screen.getByText('Some message');
    expect(message).toBeInTheDocument();

    const title = screen.getByText(getPanelTitle({ variant, textResources: suppliedTextResources, language: nb() }));
    expect(title).toBeInTheDocument();
  });

  it('should render FullWidthWrapper if no grid or baseComponentId is supplied', () => {
    render({ variant: 'info' }, {}, { grid: undefined });
    const fullWidthWrapper = screen.queryByTestId('fullWidthWrapper');
    expect(fullWidthWrapper).toBeInTheDocument();
  });

  it('should not render FullWidthWrapper if grid is supplied in context', () => {
    render({ variant: 'info' }, {}, { grid: { md: 5} });
    const fullWidthWrapper = screen.queryByTestId('fullWidthWrapper');
    expect(fullWidthWrapper).not.toBeInTheDocument();
  });

  it('should not render FullWidthWrapper if baseComponentId is supplied in context', () => {
    render({ variant: 'info' }, {}, { baseComponentId: 'some-id' });
    const fullWidthWrapper = screen.queryByTestId('fullWidthWrapper');
    expect(fullWidthWrapper).not.toBeInTheDocument();
  });
});