import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
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
    items: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    availableUntil: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ['available', 'collected'],
        default: 'available',
    },
    collectedBy: {
        type: String,
        default: null,
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
}, {
    timestamps: true,
});

export const DonationModel = mongoose.model('Donation', donationSchema);
