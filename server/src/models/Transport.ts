import mongoose, { Schema, Document } from 'mongoose';

export interface ITransport extends Document {
    name: string;
    phone: string;
    district: string;
    location: string;
    vehicleType: string;
    capacity: string;
    availability: string;
    additionalDetails?: string;
    status: 'available' | 'busy';
    createdAt: Date;
    updatedAt: Date;
}

const TransportSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    district: { type: String, required: true, lowercase: true },
    location: { type: String, required: true, trim: true },
    vehicleType: { type: String, required: true, trim: true },
    capacity: { type: String, required: true, trim: true },
    availability: { type: String, required: true, trim: true },
    additionalDetails: { type: String, trim: true },
    status: {
        type: String,
        enum: ['available', 'busy'],
        default: 'available'
    }
}, { timestamps: true });

export default mongoose.model<ITransport>('Transport', TransportSchema);
