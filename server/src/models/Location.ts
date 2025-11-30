import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
        required: true,
    }],
    collector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    contactName: {
        type: String,
        required: false,
    },
    contactPhone: {
        type: String,
        required: false,
    },
    contactImage: {
        type: String,
        required: false,
    },
    additionalPhone: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, {
    timestamps: true,
});

export interface ILocation extends mongoose.Document {
    name: string;
    district: string;
    address: string;
    description: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    images: string[];
    collector?: mongoose.Types.ObjectId;
    contactName?: string;
    contactPhone?: string;
    contactImage?: string;
    additionalPhone?: string;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

export const LocationModel = mongoose.model<ILocation>('Location', locationSchema);
