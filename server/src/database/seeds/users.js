
exports.seed = (knex) => {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([
        {
          first_name: 'Ahmed',
          last_name: 'Mohamed',
          email: 'admin@admin.com',
          phone_number: '0920000000',
          password: '$2b$10$LGSMrezP8IHBb/cNMlc1ZOKA59Fc9rY0IEk2u.iuF/y6yS2YlGP7i', // test 
          active: 1,
          language: 'ar',
          created_at: new Date(),
        },
      ]);
    });
};
