import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
    name?: string;
    thoughts?: string;
    improvements?: string;
    createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
    name: {
        type: String,
        default: 'Anonymous'
    },
    thoughts: {
        type: String,
        default: ''
    },
    improvements: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
