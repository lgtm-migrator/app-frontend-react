import * as React from 'react';

import { useAppSelector } from 'src/common/hooks';
import InstantiationErrorPage from 'src/features/instantiate/containers/InstantiationErrorPage';
import { getTextFromAppOrDefault } from 'src/utils/textResource';

import { getLanguageFromKey, getParsedLanguageFromKey } from 'altinn-shared/utils';

function InstantiateValidationError(props: { message: string }) {
  const language = useAppSelector((state) => state.language.language);
  const textResources = useAppSelector((state) => state.textResources.resources);
  if (!language) {
    return null;
  }

  function createErrorContent() {
    if (!language) {
      return null;
    }

    const errorCustomerService = getParsedLanguageFromKey(
      'instantiate.authorization_error_instantiate_validation_info_customer_service',
      language,
      [getLanguageFromKey('general.customer_service_phone_number', language)],
    );
    const customErrorMessage =
      props.message && getTextFromAppOrDefault(props.message, textResources, language, [], false);

    return (
      <>
        <span>{customErrorMessage}</span>
        <br />
        <br />
        <span>{errorCustomerService}</span>
      </>
    );
  }

  return (
    <InstantiationErrorPage
      title={getLanguageFromKey('instantiate.authorization_error_instantiate_validation_title', language)}
      content={createErrorContent()}
      statusCode={`${getLanguageFromKey('party_selection.error_caption_prefix', language)} 403`}
    />
  );
}

export default InstantiateValidationError;
