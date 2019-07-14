/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
  data : {
    key : '<input your key>', //key google app spread
    secret : '<input your secret>', //secret google app spread
    domain : 'http://livescore-api.com/api-client',
    prefix : {
      matches : '/fixtures/matches.json?',
      scores : '/scores/live.json?'
    },
    pass : '<input your pass>' //pass google app spread
  },
  db : 'http://db-api-score.herokuapp.com/'
  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};
