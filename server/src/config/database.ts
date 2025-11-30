import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        const mongoUri = process.env.MONGO_URI || '';
        console.log('📍 MongoDB URI:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));

        await mongoose.connect(mongoUri);

        console.log('✅ MongoDB connected successfully');
        console.log('📊 Database:', mongoose.connection.db?.databaseName || 'unknown');

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
        process.exit(1);
    }
};
