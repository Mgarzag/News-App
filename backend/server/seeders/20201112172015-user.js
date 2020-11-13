'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id : 3,
      email : 'dmre3@msn.com',
      username : 'DannyG',
      password : 'MadDog',
      createdAt : new Date(),
      updatedAt : new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', [{
      email :'dmre3@msn.com'
    }])
  }
};
