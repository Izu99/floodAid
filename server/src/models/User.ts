<<<<<<< HEAD
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['donor', 'collector'],
        required: true,
        default: 'donor',
    },
    faceImage: {
        type: String,
        required: false,
    },
    occupation: {
        type: String,
        required: false,
    },
    locations: [{
        district: { type: String, required: true },
        address: { type: String, required: true },
        startDate: { type: String, required: false },
        endDate: { type: String, required: false },
        startTime: { type: String, required: false },
        endTime: { type: String, required: false },
        images: [{ type: String }] // Array of image filenames
    }],
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model('User', userSchema);
=======
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['donor', 'collector'],
        required: true,
        default: 'donor',
    },
    faceImage: {
        type: String,
        required: false,
    },
    occupation: {
        type: String,
        required: false,
    },
    locations: [{
        district: { type: String, required: true },
        address: { type: String, required: true },
        startDate: { type: String, required: false },
        endDate: { type: String, required: false },
        startTime: { type: String, required: false },
        endTime: { type: String, required: false },
        images: [{ type: String }] // Array of image filenames
    }],
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model('User', userSchema);
>>>>>>> 618980a04255771618d8942af1bb77064c76a757
