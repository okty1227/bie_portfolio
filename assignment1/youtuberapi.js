const SocialBlade = require("socialblade");

const client = new SocialBlade(SOCIALBLADE_CLIENT_ID, SOCIALBLADE_ACCESS_TOKEN);

// Get a YouTube User
client.youtube.user('socialblade').then(console.log);
