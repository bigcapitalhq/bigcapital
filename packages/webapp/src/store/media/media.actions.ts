import ApiService from '@/services/ApiService';

export const submitMedia = ({
  form,
  config,
}: {
  form: FormData;
  config?: unknown;
}) => {
  return (_dispatch: unknown) =>
    ApiService.post('media', form, config as object);
};

export const deleteMedia = ({ ids }: { ids: Array<string | number> }) => {
  return (_dispatch: unknown) =>
    ApiService.delete('media', { params: { ids } });
};
