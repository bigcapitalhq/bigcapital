
export default class Auth {
  /**
   * Retrieve the authenticated user.
   */
  static get user() {
    return null;
  }

  /**
   * Sets the authenticated user.
   * @param {User} user
   */
  static setAuthenticatedUser(user) {
    this.user = user;
  }

  /**
   * Retrieve the authenticated user ID.
   */
  static userId() {
    if (!this.user) {
      return false;
    }
    return this.user.id;
  }

  /**
   * Whether the user is logged or not.
   */
  static isLogged() {
    return !!this.user;
  }

  static loggedOut() {
    this.user = null;
  }
}
