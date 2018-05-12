exports.up = (pgm) => {
  return pgm.createTable('users', {
    id: {
      type: 'text',
      primaryKey: true,
    },
    username: 'text',
    password: 'text'
  });
};

exports.down = (pgm) => {
  return pgm.dropTable('users');
};
