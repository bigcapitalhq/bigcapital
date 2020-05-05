import ApiService from "services/ApiService"

export const submitMedia = ({ form, config }) => {
  return (dispatch) => {
    return ApiService.post('media/upload', form, config);
  };
};

export const deleteMedia = ({ ids }) => {
  return (dispatch) => {
    return ApiService.delete('media', { params: { ids } });
  }
};