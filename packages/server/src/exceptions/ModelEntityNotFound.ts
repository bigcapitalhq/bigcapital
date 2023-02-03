
export default class ModelEntityNotFound extends Error {

  constructor(entityId, message?) {
    message = message || `Entity with id ${entityId} does not exist`;
    super(message);
  }
}