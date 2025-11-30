<<<<<<< HEAD
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
        required: true,
    },
}, {
    timestamps: true,
});

export const DonationModel = mongoose.model('Donation', donationSchema);
=======
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
        required: true,
    },
}, {
    timestamps: true,
});

export const DonationModel = mongoose.model('Donation', donationSchema);
>>>>>>> 618980a04255771618d8942af1bb77064c76a757
