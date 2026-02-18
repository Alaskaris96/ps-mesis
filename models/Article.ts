import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this article.'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
        type: String,
        required: [true, 'Please provide content for this article.'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL for this article.'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
