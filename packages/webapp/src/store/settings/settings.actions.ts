import ApiService from '@/services/ApiService';
import { SETTING_ADD, SETTING_SET } from '@/store/types';;
import type { SettingOption } from './settings.type';

export const submitOptions = ({ form }: { form: { options?: Array<SettingOption> } }) => {
  return (dispatch: any) =>
    ApiService.post('settings', form).then((response) => {
      dispatch({ type: SETTING_SET, options: form.options });
      return response;
    });
};

export const FetchOptions = ({ form }: { form: unknown }) => {
  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      ApiService.get('settings')
        .then((response) => {
          dispatch({ type: SETTING_SET, options: response.data.settings });
          resolve(response);
        })
        .catch((error) => reject(error));
    });
};

export const setSettings = (settings: Array<SettingOption>) => ({
  type: SETTING_SET,
  options: settings,
});

export const addSettings = (group: string, key: string, value: unknown) => ({
  type: SETTING_ADD,
  payload: { group, key, value },
});
