module.exports = function (database, username, password) {
  const url = process.env.mongodb_url;
  return url
    .replace(/<username>/, username)
    .replace(/<password>/, password)
    .replace(/<databasename>/, database);
};
