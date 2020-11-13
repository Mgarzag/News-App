'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('AuthTokens', [{
      id : 3,
      token : '23232',
      createdAt : new Date(),
      updatedAt : new Date(),
      UserId : 3
    }], {});
  },


  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('AuthTokens', [{
      token :'23232'
    }])
  }
};
