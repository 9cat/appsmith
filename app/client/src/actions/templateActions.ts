import { ReduxActionTypes } from "constants/ReduxActionConstants";

export const getAllTemplates = () => ({
  type: ReduxActionTypes.GET_ALL_TEMPLATES_INIT,
});

export const filterTemplates = (category: string, filterList: string[]) => ({
  type: ReduxActionTypes.UPDATE_TEMPLATE_FILTERS,
  payload: {
    category,
    filterList,
  },
});

export const setTemplateSearchQuery = (query: string) => ({
  type: ReduxActionTypes.SET_TEMPLATE_SEARCH_QUERY,
  payload: query,
});

export const importTemplateToOrganisation = (
  templateId: string,
  organizationId: string,
) => ({
  type: ReduxActionTypes.IMPORT_TEMPLATE_TO_ORGANISATION_INIT,
  payload: {
    templateId,
    organizationId,
  },
});

export const getSimilarTemplatesInit = (templateId: string) => ({
  type: ReduxActionTypes.GET_SIMILAR_TEMPLATES_INIT,
  payload: templateId,
});

export const setTemplateNotificationSeenAction = (payload: boolean) => ({
  type: ReduxActionTypes.SET_TEMPLATE_NOTIFICATION_SEEN,
  payload,
});

export const getTemplateNotificationSeenAction = () => ({
  type: ReduxActionTypes.GET_TEMPLATE_NOTIFICATION_SEEN,
});

export const getTemplateInformation = (payload: string) => ({
  type: ReduxActionTypes.GET_TEMPLATE_INIT,
  payload,
});
