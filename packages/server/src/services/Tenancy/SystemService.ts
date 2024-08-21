import Container from 'typedi';
import { Service } from 'typedi';

@Service()
export default class HasSystemService implements SystemService {
  private container(key: string) {
    return Container.get(key);
  }

  knex() {
    return this.container('knex');
  }

  repositories() {
    return this.container('repositories');
  }

  cache() {
    return this.container('cache');
  }
}
