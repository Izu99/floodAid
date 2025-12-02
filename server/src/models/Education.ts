import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation extends Document {
    name: string;
    contactPerson: string;
    phone: string;
    district: string;
    address: string;
    school?: string;
    grade?: string;
    needs: string;
    additionalDetails?: string;
    status: 'pending' | 'fulfilled';
    createdAt: Date;
    updatedAt: Date;
}

const EducationSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    district: { type: String, required: true, lowercase: true },
    address: { type: String, required: true, trim: true },
    school: { type: String, trim: true },
    grade: { type: String, trim: true },
    needs: { type: String, required: true, trim: true },
    additionalDetails: { type: String, trim: true },
    status: {
        type: String,
        enum: ['pending', 'fulfilled'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model<IEducation>('Education', EducationSchema);
