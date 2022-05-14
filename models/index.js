const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// create association
// one to many relationship
// one user can create many posts
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// post can only belong to one user
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

// voter many to many relationship
// see which users voted on a single post
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

// see which posts a single user voted on
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// comments belong to a particular user
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

// comments belong to a particular post
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

// one User can post many comments
User.hasMany(Comment, {
    foreignKey: 'user_id'
});

// one post can have many comments
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Comment };