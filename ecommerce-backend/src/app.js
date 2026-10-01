const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const couponRoutes = require('./routes/couponRoutes')
const { notFound, errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }))
app.use(express.json())
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', author: 'Engr Fazl Ullah' }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/coupons', couponRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
