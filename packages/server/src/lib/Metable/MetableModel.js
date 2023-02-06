

export default class Metable{

  static get modifiers() {
    return {
      whereKey(builder, key) {
        builder.where('key', key);
      },
    };
  }
}