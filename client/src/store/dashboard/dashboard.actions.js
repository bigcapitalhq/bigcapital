import t from 'store/types';

export function openDialog(name, payload) {
  return {
    type: t.OPEN_DIALOG,
    name: name,
    payload: payload,
  };
};

export function closeDialog(name, payload) {
  return {
    type: t.CLOSE_DIALOG,
    name: name,
    payload: payload,
  }
}