import type { IDataModelBindings } from 'src/types';

export interface IFetchFormData {
  url: string;
}

export interface IFetchFormDataFulfilled {
  formData: any;
}

export interface IFormDataRejected {
  error: Error | null;
}

export interface ISubmitDataAction {
  url?: string;
  apiMode?: string;
  stopWithWarnings?: boolean;
  componentId: string;
}

export interface ISingleFieldValidation {
  layoutId: string;
  dataModelBinding: string;
}

export interface ISaveAction {
  field?: string;
  componentId?: string;
  singleFieldValidation?: ISingleFieldValidation;
}

export interface IUpdateFormDataProps {
  skipValidation?: boolean;
  skipAutoSave?: boolean;
  singleFieldValidation?: ISingleFieldValidation;
}

export interface IUpdateFormData extends IUpdateFormDataProps {
  field: string;
  data: any;
  componentId?: string;
}

export interface IUpdateFormDataFulfilled extends IUpdateFormDataProps {
  field: string;
  componentId?: string;
  data: any;
}

export interface IDeleteAttachmentReference {
  attachmentId: string;
  componentId: string;
  dataModelBindings: IDataModelBindings;
}
