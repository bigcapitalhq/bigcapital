import Bookshelf from 'bookshelf';
import jsonColumns from 'bookshelf-json-columns';
import bookshelfParanoia from 'bookshelf-paranoia';
import bookshelfModelBase from 'bookshelf-modelbase';
import knex from '../database/knex';

const bookshelf = Bookshelf(knex);

bookshelf.plugin('pagination');
bookshelf.plugin('visibility');
bookshelf.plugin('registry');
bookshelf.plugin('virtuals');
bookshelf.plugin(jsonColumns);
bookshelf.plugin(bookshelfParanoia);
bookshelf.plugin(bookshelfModelBase.pluggable);

export default bookshelf;
