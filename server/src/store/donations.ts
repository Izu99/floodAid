import { Donation } from '../types/donation';

class DonationStore {
    private donations: Donation[] = [];
    private idCounter = 1;

    create(data: Omit<Donation, 'id' | 'collected' | 'createdAt'>): Donation {
        const donation: Donation = {
            id: String(this.idCounter++),
            ...data,
            collected: false,
            createdAt: new Date().toISOString(),
        };
        this.donations.unshift(donation); // Add to beginning for newest first
        return donation;
    }

    getAll(page: number = 1, limit: number = 15): { data: Donation[]; total: number } {
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            data: this.donations.slice(start, end),
            total: this.donations.length,
        };
    }

    findById(id: string): Donation | undefined {
        return this.donations.find(d => d.id === id);
    }

    markAsCollected(id: string): Donation | null {
        const donation = this.findById(id);
        if (donation) {
            donation.collected = true;
            return donation;
        }
        return null;
    }

    // Seed some sample data for testing
    seedData() {
        const items = ['Books', 'Clothes', 'Food Items', 'Medicines', 'Blankets', 'Water Bottles'];
        const names = ['Kamal Silva', 'Nimal Perera', 'Saman Fernando', 'Amila Rajapaksa'];

        for (let i = 0; i < 20; i++) {
            this.create({
                name: names[i % names.length],
                phone: `077${Math.floor(1000000 + Math.random() * 9000000)}`,
                address: `No. ${i + 1}, Main Street, Colombo`,
                items: items[i % items.length],
                note: i % 3 === 0 ? 'Urgent - Please collect soon' : undefined,
            });
        }
    }
}

export const donationStore = new DonationStore();
// Seed initial data
donationStore.seedData();
