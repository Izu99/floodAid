import mongoose, { Schema, Document } from 'mongoose';

export interface IHelpRequest extends Document {
    name: string;
    phone: string;
    additionalPhone?: string;
    district: string;
    address: string;
    helpDescription: string;
    additionalDetails?: string;
    status: 'pending' | 'in-progress' | 'fulfilled';
    createdAt: Date;
    updatedAt: Date;
}

const HelpRequestSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    additionalPhone: {
        type: String,
        trim: true
    },
    district: {
        type: String,
        required: true,
        lowercase: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    helpDescription: {
        type: String,
        required: true,
        trim: true
    },
    additionalDetails: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'fulfilled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export default mongoose.model<IHelpRequest>('HelpRequest', HelpRequestSchema);
