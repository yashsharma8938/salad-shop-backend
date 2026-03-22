require('dotenv').config();
const mongoose = require('mongoose');
const Salad = require('./models/Salad');
const User = require('./models/User');
const Review = require('./models/Review');
const Settings = require('./models/Settings');

const salads = [
    {
        name: 'Classic Caesar Salad',
        description: 'Crisp romaine lettuce with creamy Caesar dressing, homemade croutons, and shaved parmesan.',
        price: 199,
        image: '/images/caesar.jpg',
        ingredients: ['Romaine Lettuce', 'Parmesan', 'Croutons', 'Caesar Dressing', 'Lemon'],
        tags: ['Protein', 'Low Calories'],
        category: 'Salad',
        isAvailable: true,
        stock: 15,
        isTrending: true,
        rating: 4.8,
        ordersToday: 12
    },
    {
        name: 'Greek Garden Bowl',
        description: 'Fresh cucumbers, tomatoes, olives, red onion, and feta cheese with olive oil dressing.',
        price: 179,
        image: '/images/greek.jpg',
        ingredients: ['Cucumber', 'Tomato', 'Olives', 'Feta Cheese', 'Red Onion', 'Olive Oil'],
        tags: ['Vegan', 'Low Calories'],
        category: 'Salad',
        isAvailable: true,
        stock: 20,
        isTrending: true,
        rating: 4.6,
        ordersToday: 8
    },
    {
        name: 'Quinoa Power Bowl',
        description: 'Protein-packed quinoa with roasted chickpeas, avocado, cherry tomatoes, and tahini dressing.',
        price: 249,
        image: '/images/quinoa.jpg',
        ingredients: ['Quinoa', 'Chickpeas', 'Avocado', 'Cherry Tomatoes', 'Tahini', 'Spinach'],
        tags: ['Protein', 'Vegan', 'High Fiber'],
        category: 'Bowl',
        isAvailable: true,
        stock: 12,
        isTrending: true,
        rating: 4.9,
        ordersToday: 15
    },
    {
        name: 'Asian Sesame Crunch',
        description: 'Crunchy cabbage, carrots, edamame, and crispy wonton strips with sesame ginger dressing.',
        price: 219,
        image: '/images/asian.jpg',
        ingredients: ['Cabbage', 'Carrots', 'Edamame', 'Wonton Strips', 'Sesame Seeds', 'Ginger Dressing'],
        tags: ['Vegan', 'High Fiber'],
        category: 'Salad',
        isAvailable: true,
        stock: 18,
        isTrending: false,
        rating: 4.5,
        ordersToday: 6
    },
    {
        name: 'Tropical Mango Delight',
        description: 'Fresh mango, strawberries, mixed greens, nuts, and honey lime dressing.',
        price: 229,
        image: '/images/tropical.jpg',
        ingredients: ['Mango', 'Strawberries', 'Mixed Greens', 'Almonds', 'Honey Lime Dressing'],
        tags: ['Vegan', 'Low Calories'],
        category: 'Salad',
        isAvailable: true,
        stock: 10,
        isTrending: true,
        rating: 4.7,
        ordersToday: 9
    },
    {
        name: 'Mediterranean Feast',
        description: 'Hummus, falafel, tabbouleh, mixed greens, and tzatziki sauce in a hearty bowl.',
        price: 269,
        image: '/images/mediterranean.jpg',
        ingredients: ['Hummus', 'Falafel', 'Tabbouleh', 'Mixed Greens', 'Tzatziki', 'Pita Chips'],
        tags: ['Protein', 'High Fiber'],
        category: 'Bowl',
        isAvailable: true,
        stock: 14,
        isTrending: true,
        rating: 4.8,
        ordersToday: 11
    },
    {
        name: 'Keto Green Machine',
        description: 'Avocado, bacon bits, boiled eggs, spinach, and ranch dressing — low carb perfection.',
        price: 259,
        image: '/images/keto.jpg',
        ingredients: ['Avocado', 'Bacon', 'Boiled Eggs', 'Spinach', 'Ranch Dressing', 'Cheese'],
        tags: ['Protein', 'Keto'],
        category: 'Salad',
        isAvailable: true,
        stock: 8,
        isTrending: false,
        rating: 4.4,
        ordersToday: 5
    },
    {
        name: 'Berry Bliss Bowl',
        description: 'Mixed berries, granola, Greek yogurt, chia seeds, and a drizzle of honey.',
        price: 199,
        image: '/images/berry.jpg',
        ingredients: ['Blueberries', 'Strawberries', 'Granola', 'Greek Yogurt', 'Chia Seeds', 'Honey'],
        tags: ['Protein', 'Low Calories'],
        category: 'Bowl',
        isAvailable: true,
        stock: 16,
        isTrending: false,
        rating: 4.6,
        ordersToday: 7
    }
];

const reviews = [
    { rating: 5, comment: 'Absolutely love the freshness! You can taste the difference from store-bought.', userName: 'Priya S.' },
    { rating: 5, comment: 'Best salads in town! My kids actually enjoy eating healthy now.', userName: 'Rahul M.' },
    { rating: 4, comment: 'Great portions and fresh ingredients. The quinoa bowl is my favorite!', userName: 'Anita K.' },
    { rating: 5, comment: 'So happy I found this! Homemade quality with delivery convenience.', userName: 'Sneha D.' },
    { rating: 4, comment: 'Love the transparency of the live kitchen! Really builds trust.', userName: 'Vikram P.' },
    { rating: 5, comment: 'My go-to for daily healthy lunch. The Caesar salad is chef-level!', userName: 'Meera R.' },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Salad.deleteMany({});
        await Review.deleteMany({});
        await Settings.deleteMany({});
        console.log('Cleared existing data');

        // Seed salads
        const createdSalads = await Salad.insertMany(salads);
        console.log(`✅ Seeded ${createdSalads.length} salads`);

        // Create admin user
        let admin = await User.findOne({ email: 'admin@saladshop.com' });
        if (!admin) {
            admin = await User.create({ email: 'admin@saladshop.com', name: 'Admin', isAdmin: true });
            console.log('✅ Admin user created (admin@saladshop.com)');
        }

        // Create demo user
        let demo = await User.findOne({ email: 'demo@saladshop.com' });
        if (!demo) {
            demo = await User.create({
                email: 'demo@saladshop.com',
                name: 'Demo User',
                addresses: [{ label: 'Home', street: '123 Green Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true }]
            });
            console.log('✅ Demo user created (demo@saladshop.com)');
        }

        // Seed reviews
        const reviewDocs = reviews.map((r, i) => ({
            ...r,
            user: demo._id,
            salad: createdSalads[i % createdSalads.length]._id
        }));
        await Review.insertMany(reviewDocs);
        console.log(`✅ Seeded ${reviewDocs.length} reviews`);

        // Seed settings
        await Settings.create({
            liveStreamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            liveStreamEnabled: true,
            healthTip: 'Did you know? Eating salads daily can boost your immunity by 40%! 🥬',
            popupMessages: [
                '🥗 Time to recharge with something healthy!',
                '🥗 Your body deserves fresh salads today!',
                '🥗 Fresh salads prepared today – order before they sell out!',
                '🥗 Healthy food time! Dive into fresh bowls.',
                '🥗 Only a few bowls left today! Order now!',
                '🥗 3 people ordered this in the last 10 minutes!'
            ]
        });
        console.log('✅ Settings seeded');

        console.log('\n🎉 Database seeded successfully!');
        console.log('Admin login: admin@saladshop.com (OTP: 123456)');
        console.log('Demo login: demo@saladshop.com (OTP: 123456)');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();
