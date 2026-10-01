require('dotenv').config()
const { sequelize, Category, Product, Coupon } = require('../models')

const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: '🎧' },
  { id: 'fashion', name: 'Fashion', icon: '🧥' },
  { id: 'shoes', name: 'Shoes', icon: '👟' },
  { id: 'accessories', name: 'Accessories', icon: '🎒' },
  { id: 'home', name: 'Home', icon: '🏺' },
  { id: 'beauty', name: 'Beauty', icon: '🧴' },
]

// Same catalog the frontend previously mocked locally, so behavior looks
// identical once the frontend is switched over to this API.
const PRODUCTS = [
  { name: 'Aria Wireless Headphones', brand: 'Novasound', categoryId: 'electronics', price: 89.0, salePrice: 64.0, rating: 4.5, reviewCount: 0, stock: 24, image: '🎧', description: 'Over-ear wireless headphones with 30-hour battery life and active noise cancellation.', specs: { 'Battery life': '30 hours', 'Connectivity': 'Bluetooth 5.2', 'Weight': '250g' }, colors: ['Black', 'Sand', 'Sage'] },
  { name: 'Trail Runner Sneakers', brand: 'Fieldstock', categoryId: 'shoes', price: 120.0, salePrice: 96.0, rating: 4.7, reviewCount: 0, stock: 15, image: '👟', description: 'Lightweight trail sneakers with reinforced grip for uneven terrain.', specs: { 'Upper': 'Recycled mesh', 'Sole': 'Rubber lug', 'Weight': '280g' }, sizes: ['7', '8', '9', '10', '11'] },
  { name: 'Canvas Weekend Backpack', brand: 'Fieldstock', categoryId: 'accessories', price: 75.0, salePrice: 75.0, rating: 4.3, reviewCount: 0, stock: 40, image: '🎒', description: 'A durable 22L canvas backpack with a padded laptop sleeve.', specs: { 'Capacity': '22L', 'Material': 'Waxed canvas', 'Laptop sleeve': 'Up to 15"' }, colors: ['Olive', 'Charcoal'] },
  { name: 'Merino Wool Sweater', brand: 'Heathfield', categoryId: 'fashion', price: 110.0, salePrice: 82.5, rating: 4.6, reviewCount: 0, stock: 0, image: '🧥', description: 'A breathable merino wool crewneck, soft enough for everyday wear.', specs: { 'Material': '100% merino wool', 'Fit': 'Regular', 'Care': 'Hand wash' }, sizes: ['S', 'M', 'L', 'XL'], colors: ['Charcoal', 'Cream'] },
  { name: 'Ceramic Pour-Over Set', brand: 'Kiln & Co', categoryId: 'home', price: 58.0, salePrice: 46.4, rating: 4.8, reviewCount: 0, stock: 33, image: '🏺', description: 'Hand-glazed ceramic pour-over dripper with matching mug.', specs: { 'Material': 'Stoneware', 'Capacity': '350ml', 'Dishwasher safe': 'Yes' } },
  { name: 'Mineral Face Serum', brand: 'Loam', categoryId: 'beauty', price: 42.0, salePrice: 42.0, rating: 4.4, reviewCount: 0, stock: 60, image: '🧴', description: 'A lightweight daily serum with squalane and niacinamide.', specs: { 'Volume': '30ml', 'Skin type': 'All types' } },
  { name: 'Aviator Sunglasses', brand: 'Solstice', categoryId: 'accessories', price: 65.0, salePrice: 48.75, rating: 4.2, reviewCount: 0, stock: 18, image: '🕶️', description: 'Polarized aviator sunglasses with UV400 protection.', specs: { 'Lens': 'Polarized glass', 'Frame': 'Stainless steel' }, colors: ['Gold', 'Gunmetal'] },
  { name: 'Everyday Leather Wallet', brand: 'Fieldstock', categoryId: 'accessories', price: 48.0, salePrice: 48.0, rating: 4.6, reviewCount: 0, stock: 50, image: '👛', description: 'A slim bifold wallet in full-grain leather that ages beautifully.', specs: { 'Material': 'Full-grain leather', 'Card slots': '6' } },
  { name: 'Smart Fitness Watch', brand: 'Novasound', categoryId: 'electronics', price: 199.0, salePrice: 149.25, rating: 4.3, reviewCount: 0, stock: 12, image: '⌚', description: 'Track workouts, sleep, and heart rate with a 10-day battery life.', specs: { 'Battery life': '10 days', 'Water resistance': '5ATM' }, colors: ['Black', 'Sand'] },
  { name: 'Linen Button-Up Shirt', brand: 'Heathfield', categoryId: 'fashion', price: 68.0, salePrice: 68.0, rating: 4.1, reviewCount: 0, stock: 27, image: '👔', description: 'Breathable linen shirt cut for warm-weather layering.', specs: { 'Material': '100% linen' }, sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Olive'] },
  { name: 'Slide Sandals', brand: 'Fieldstock', categoryId: 'shoes', price: 38.0, salePrice: 28.5, rating: 4.0, reviewCount: 0, stock: 45, image: '🩴', description: 'Recovery slides with a contoured cushioned footbed.', specs: { 'Material': 'EVA foam' }, sizes: ['7', '8', '9', '10', '11'] },
  { name: 'Table Lamp, Amber Glass', brand: 'Kiln & Co', categoryId: 'home', price: 84.0, salePrice: 84.0, rating: 4.7, reviewCount: 0, stock: 20, image: '💡', description: 'A warm amber glass table lamp with a dimmable LED bulb included.', specs: { 'Bulb included': 'Yes, dimmable LED', 'Material': 'Glass, brass' } },
]

const COUPONS = [
  { code: 'SAVE10', percent: 10, active: true },
  { code: 'WELCOME20', percent: 20, active: true },
]

async function seed() {
  await sequelize.sync({ force: true }) // drops & recreates tables — dev/seed use only
  console.log('Tables recreated.')

  await Category.bulkCreate(CATEGORIES)
  console.log(`Seeded ${CATEGORIES.length} categories.`)

  for (const p of PRODUCTS) {
    await Product.create({
      name: p.name,
      brand: p.brand,
      categoryId: p.categoryId,
      price: p.price,
      salePrice: p.salePrice,
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      image: p.image,
      description: p.description,
      specsJson: JSON.stringify(p.specs || {}),
      colorsJson: p.colors ? JSON.stringify(p.colors) : null,
      sizesJson: p.sizes ? JSON.stringify(p.sizes) : null,
    })
  }
  console.log(`Seeded ${PRODUCTS.length} products.`)

  await Coupon.bulkCreate(COUPONS)
  console.log(`Seeded ${COUPONS.length} coupons.`)

  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
