import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { connect, model, Schema } from 'mongoose';

dotenv.config({ path: __dirname + '/../.env' });

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, default: 'https://via.placeholder.com/300' },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    soldOut: { type: Boolean, default: false },
    badge: { type: String, default: '' },
    avgRating: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Product = model('Product', ProductSchema);

const SAMPLE = [
  {
    name: 'Handwoven Dumbara Mat',
    image: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional Dumbara handwoven mat made by Kurunegala artisans.',
    price: 4500,
    stock: 20,
    soldOut: false,
    badge: 'Hot',
    avgRating: 4.8,
  },
  {
    name: 'Clay Pottery Vase',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-crafted clay vase with traditional Sri Lankan patterns.',
    price: 3200,
    stock: 15,
    soldOut: false,
    badge: 'New',
    avgRating: 4.6,
  },
  {
    name: 'Brass Oil Lamp',
    image: 'https://images.unsplash.com/photo-1605883705077-8d3d3cebe78c?auto=format&fit=crop&w=800&q=80',
    description: 'Authentic brass oil lamp, perfect for home temples and decor.',
    price: 6800,
    stock: 10,
    soldOut: false,
    badge: '',
    avgRating: 4.9,
  },
];

async function run() {
  const uri = process.env.MONGODB_URI as string;
  if (!uri || uri.includes('<ATLAS_PASSWORD>')) {
    console.error('Set a real MONGODB_URI in backend/.env (replace <ATLAS_PASSWORD>) before seeding.');
    process.exit(1);
  }
  await connect(uri);
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(SAMPLE);
    console.log(`Seeded ${SAMPLE.length} products.`);
  } else {
    console.log(`Skipped seeding: ${count} products already exist.`);
  }
  process.exit(0);
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
