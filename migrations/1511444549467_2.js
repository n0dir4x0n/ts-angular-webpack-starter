exports.up = (pgm) => {
  return pgm.createTable('accessTokens', {
    id: {
      type: 'text',
      primaryKey: true,
    },
    userId: {
      type: 'text',
      references: '"users"'
    }
  });
};

exports.down = (pgm) => {
  return pgm.dropTable('accessTokens');
};
