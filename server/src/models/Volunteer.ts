import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteer extends Document {
    name: string;
    phone: string;
    district: string;
    skills: string;
    availability: string;
    additionalDetails?: string;
    status: 'available' | 'busy';
    createdAt: Date;
    updatedAt: Date;
}

const VolunteerSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    district: { type: String, required: true, lowercase: true },
    skills: { type: String, required: true, trim: true },
    availability: { type: String, required: true, trim: true },
    additionalDetails: { type: String, trim: true },
    status: {
        type: String,
        enum: ['available', 'busy'],
        default: 'available'
    }
}, { timestamps: true });

export default mongoose.model<IVolunteer>('Volunteer', VolunteerSchema);
