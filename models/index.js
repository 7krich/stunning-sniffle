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

// comments belong to a particular user
Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
});

// comments belong to a particular post
Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'cascade'
});

// one User can post many comments
User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
});

// one post can have many comments
Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'cascade'
});

module.exports = { User, Post, Comment };