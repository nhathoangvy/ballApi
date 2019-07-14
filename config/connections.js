/**
 * Connections
 * (sails.config.connections)
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `sails-mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.connections.html
 */

module.exports.connections = {

  /***************************************************************************
  *                                                                          *
  * Local disk storage for DEVELOPMENT ONLY                                  *
  *                                                                          *
  * Installed by default.                                                    *
  *                                                                          *
  ***************************************************************************/
  localDiskDb: {
    adapter: 'sails-disk'
  },
  drive : 
  {
    "type": "service_account",
    "project_id": "soccer-205908",
    "private_key_id": "f50f608a1167d4b39058dcc51f5dc54b1d81b7ac",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsHuuCzt4eh0kd\n7hGFUJImRUeJtBC/QWQFQVWSrphj1Cg7gbygT4hcZvgH7ilYuiAgRO30d1376AaY\nXyAVnVKLd6cBZOCr2PCsROx4FaPMVexaN/ib4lUKMgU6ay/B7DoKey6ARZuoI728\nsvnJO3xnNON0UqaCRtFJtmlVDz9Cr0DWWMTr3y4YK2FTaJbocBdf+25tlleSQpz/\ncNgwCeb3OuXWqI14uWjMBSBIty4mqiA0M5UOXRpCsv7DuO0M+Y8At9iuo/QEN6Vg\nDbfsNTWBByE7kiRdGHdwV+i29vYmV3k7V+kWewAppWzJ30jIQPkVT2tW3pubCcdN\nuNbQzxOLAgMBAAECggEAOEfV/4xQIhBfjqtZTEvXti7iIPthnIAvye4eopt3lfD6\nBNc7y/mln31F7iXonCwkNBkF6/GaKDQq7+ju71JletgxoimPs3F45QOWhP+icz7H\nTYrOvn4oC3Dmt77zu0fYhLPZtTTNnJGvSYQGXFAYshCfrVoXOzMX3TAJyjf1mgJ0\nyWnjwWov7u3c8znahO8ZHJAXllMvvP/hy2sZR7mS2FdzPrln31nZJdCjF4Y0dfao\n3+s3/sR347GBPpYd7+i/i+/cNT8XYdv3OxBhyVFxn5J3o2efLzWjt3v541HfC2Ox\nmOl2Y0Bxkp2PWwOr9tqehCxqZS1/g09F8VjoPkEDpQKBgQDvjrGRPjwJT0ziblwd\nIckqpgl+4TA+7e0ji4shBpun0VyNHTNdF8HeI6M62VtJBdiW8Kq+MJwIn2JN4J8G\nWJRcEBYG8EKV287t8b0o1PfB8/1P1fqxT6RMZR0DV/wETulJyevagf9qn8/k45IA\n9VwvNyipPxgKozCxEtENqqg41QKBgQC370kNYBJVk8nxm0cTGGwKpkd+BOoNe2Sb\nT3ya24gUUm4ciaQ5zRzhHC3S9t3W5fhnqInBFSSXI+SStcXucgnIF2YCWe11cQUB\nxX2IMgnZxiC+/s3Hiaj1hIXiLADAjHEL7Qc3RynPEgM8tzQwHEKOL/KPBBh8Fq12\nY6GyVHhK3wKBgECF+qXYUWtghKDogL8H/psSJbSbCteoVhsg1tSKZxqIdZk8qD0G\nzRz8FFchfEjq3i+pmxOnHB/mbh/zxGF9MliprIUp6YVbsxy74+s/kYwYH76FMATa\nIrLA+VOROzwd1RAe5vvvz8/0Q5avBQBlFfNRtA4CBIO4+MB5BP3dXXoRAoGAR/PG\nKwJLCckPdYEds52ZHi1fyC9Z874yZAMbJmT8fZ6lTmqVoLrZMkJYtq81psw9eSdY\nA/0mXC2BS9bpv9ZCd1CX6hGNr6RvpfrAmZehfNxhkPWSQB1cx/Z4fTpjbO9DhbvK\nV9hxxXwxYf3032EetAqTo1ihz2D7qFVfOqiKihcCgYAy1WglDLO7TZt74mxHlhW1\nLvMFAhDis4BTzVP3PgscRyj/A6EPT37aIKYmWe3jD7NBr5CCqvTWx/R7vdokDGZF\ntKNeKnWXXkHfZEMhPLMGi69hgcouBWommcgeh+iq5GnFL6PQvGD3GJ3gXaPHw+1g\nUDa0H6JMOHBObqxLyFGbtw==\n-----END PRIVATE KEY-----\n",
    "client_email": "soccer@soccer-205908.iam.gserviceaccount.com",
    "client_id": "105644139304804451978",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/soccer%40soccer-205908.iam.gserviceaccount.com"
  },
  keyrows : {
    user : '17Qd3NXO7onFRqCFHJ7HYXTY7s7HipwOSj_tfRKptPLU',
    token : '1kG0VdDx_mEv1odcZgIIZmjW7LTR1IMvRlwACHCSYQLM',
    score : '1M9R8igB_KEu01DX9-eIiYIH1pthD_hJAOKdZyBb0uCU',
    matches : '1npczhMrQ9hqB2w7gi1C2H59dBOWIRTa2fC6kB9hYPZM',
    messages : '1jEf9-Deg80Ul_B3oxuNfoiRd1E5UlDmqEz2Ksc2peno',
  }
  /***************************************************************************
  *                                                                          *
  * MySQL is the world's most popular relational database.                   *
  * http://en.wikipedia.org/wiki/MySQL                                       *
  *                                                                          *
  * Run: npm install sails-mysql                                             *
  *                                                                          *
  ***************************************************************************/
  // someMysqlServer: {
  //   adapter: 'sails-mysql',
  //   host: 'YOUR_MYSQL_SERVER_HOSTNAME_OR_IP_ADDRESS',
  //   user: 'YOUR_MYSQL_USER', //optional
  //   password: 'YOUR_MYSQL_PASSWORD', //optional
  //   database: 'YOUR_MYSQL_DB' //optional
  // },

  /***************************************************************************
  *                                                                          *
  * MongoDB is the leading NoSQL database.                                   *
  * http://en.wikipedia.org/wiki/MongoDB                                     *
  *                                                                          *
  * Run: npm install sails-mongo                                             *
  *                                                                          *
  ***************************************************************************/
  // someMongodbServer: {
  //   adapter: 'sails-mongo',
  //   host: 'localhost',
  //   port: 27017,
  //   user: 'username', //optional
  //   password: 'password', //optional
  //   database: 'your_mongo_db_name_here' //optional
  // },

  /***************************************************************************
  *                                                                          *
  * PostgreSQL is another officially supported relational database.          *
  * http://en.wikipedia.org/wiki/PostgreSQL                                  *
  *                                                                          *
  * Run: npm install sails-postgresql                                        *
  *                                                                          *
  *                                                                          *
  ***************************************************************************/
  // somePostgresqlServer: {
  //   adapter: 'sails-postgresql',
  //   host: 'YOUR_POSTGRES_SERVER_HOSTNAME_OR_IP_ADDRESS',
  //   user: 'YOUR_POSTGRES_USER', // optional
  //   password: 'YOUR_POSTGRES_PASSWORD', // optional
  //   database: 'YOUR_POSTGRES_DB' //optional
  // }


  /***************************************************************************
  *                                                                          *
  * More adapters: https://github.com/balderdashy/sails                      *
  *                                                                          *
  ***************************************************************************/

};
