require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY)
const VENDORS = require('./vendors')

const app = express()

app.use('/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    const allowed = (process.env.CLIENT_URL || '').split(',').map(s => s.trim())
    if (allowed.some(u => origin === u || origin.endsWith('.vercel.app') || origin.endsWith('.fliplabs.shop'))) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
}))

// ─── Plan config ─────────────────────────────────────────────────────────────

const PRICE_IDS = () => ({
  beginner:     process.env.BEGINNER_PRICE_ID,
  intermediate: process.env.INTERMEDIATE_PRICE_ID,
  pro:          process.env.PRO_PRICE_ID,
})

const PLAN_NAMES = () => ({
  [process.env.BEGINNER_PRICE_ID]:     'beginner',
  [process.env.INTERMEDIATE_PRICE_ID]: 'intermediate',
  [process.env.PRO_PRICE_ID]:          'pro',
})

const PLAN_DISPLAY = {
  beginner:     'Beginner Plan',
  intermediate: 'Intermediate Plan',
  pro:          'Pro Plan',
}

// ─── Member content (NEVER exposed to public pages) ──────────────────────────

function getMemberContent(tier) {
  // Electronics (Beginner+), Fragrance (Beginner+), Clothing/Hoodies (Beginner+)
  // Shoes, Jewelry, Watches — Intermediate+ only
  const BEGINNER_CATS = [
    { id: 'electronics', name: 'Electronics', icon: '📱', items: VENDORS.electronics },
    { id: 'fragrance',   name: 'Fragrance',   icon: '🌹', items: VENDORS.fragrance },
    { id: 'clothing',    name: 'Clothing',     icon: '👕', items: VENDORS.clothing },
  ]
  const ALL_CATS = [
    ...BEGINNER_CATS,
    { id: 'shoes',   name: 'Shoes',   icon: '👟', items: VENDORS.shoes },
    { id: 'jewelry', name: 'Jewelry', icon: '💎', items: VENDORS.jewelry },
    { id: 'watches', name: 'Watches', icon: '⌚', items: VENDORS.watches },
  ]
  const INTERMEDIATE_LOCKED = [
    { id: 'shoes',   name: 'Shoes',   icon: '👟', tier: 'intermediate' },
    { id: 'jewelry', name: 'Jewelry', icon: '💎', tier: 'intermediate' },
    { id: 'watches', name: 'Watches', icon: '⌚', tier: 'intermediate' },
  ]

  const content = {
    beginner: {
      categories: BEGINNER_CATS,
      lockedCategories: INTERMEDIATE_LOCKED,
      guides: [
        { title: 'Your Vendor Directory',      desc: 'Electronics, Fragrance, and Clothing suppliers — all verified and ready to source from.' },
        { title: 'Step-by-Step Flip Guides',   desc: 'Exactly how to source, list, and flip products for consistent profit.' },
        { title: 'Pricing Strategy Templates', desc: 'Pre-built tools to calculate your margins and set the right price every time.' },
        { title: 'Priority Discord Role',      desc: 'Members-only channel with fellow resellers sharing deals and wins daily.' },
      ],
    },
    intermediate: {
      categories: ALL_CATS,
      lockedCategories: [],
      guides: [
        { title: 'All 6 Vendor Categories',        desc: 'Full access to every category in the Flip Labs directory.' },
        { title: 'Automation & Scaling SOPs',       desc: 'Standard operating procedures to automate tasks and scale your operation.' },
        { title: 'Platform Fee Calculators',        desc: 'Calculate exact net profit after eBay, StockX, Amazon, and GOAT fees.' },
        { title: 'Monthly Sourcing Calls',          desc: 'Live group calls every month with the Flip Labs team. Replays included.' },
        { title: 'Private Deal Alerts',             desc: 'Exclusive alerts on high-margin products and restocks before they go public.' },
      ],
    },
    pro: {
      categories: ALL_CATS,
      lockedCategories: [],
      guides: [
        { title: 'Full Pro Vendor Directory',       desc: 'Every vendor category including exclusive Shoes, Jewelry, and Watches.' },
        { title: '1-on-1 Onboarding Call',          desc: 'Personal call to set up your operation and answer every question you have.' },
        { title: 'Exclusive Brand Accounts',        desc: 'Brand-authorized accounts with priority access and restocking.' },
        { title: 'Direct Supplier Introductions',   desc: 'Personal warm introductions to our top wholesale contacts.' },
        { title: 'Early Access to Restocks',        desc: 'Notified before restocks go live so you can move first every time.' },
        { title: 'Wholesale Unlock Guides',         desc: 'How to get approved for wholesale accounts with major brands, step by step.' },
        { title: 'Hot Product Alerts',              desc: 'Real-time alerts on trending products with high resale margins.' },
        { title: 'Pro Discord Access',              desc: 'Exclusive pro-only Discord with direct access to the Flip Labs team.' },
      ],
    },
  }

  return content[tier] || null
}

// ─── In-memory user store ────────────────────────────────────────────────────
// Users persist while the server is running. Survives multiple requests.
// Resets only on server restart (upgrade Render to avoid this).

const users = {}

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

function expireIfNeeded(user) {
  if (!user || user.tier === 'free' || user.tier === 'admin') return user
  if (!user.subscriptionEnd) return user
  const now = Date.now()
  const graceEnd = user.graceUntil || (user.subscriptionEnd + 3 * 24 * 60 * 60 * 1000)
  if (now > graceEnd) {
    user.tier = 'free'; user.subscriptionActive = false
    user.expiredAt = user.expiredAt || user.subscriptionEnd
  } else if (now > user.subscriptionEnd) {
    user.graceUntil = user.graceUntil || graceEnd
  }
  return user
}

// ─── Auth routes ─────────────────────────────────────────────────────────────

app.post('/auth/signup', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.json({ success: false, error: 'Email and password required.' })
  const key = email.trim().toLowerCase()
  if (users[key]) return res.json({ success: false, error: 'Account already exists. Please log in.' })
  users[key] = {
    email: key, password: password.trim(), tier: 'free',
    createdAt: Date.now(), subscriptionActive: false,
    subscriptionEnd: null, paidAt: null, stripeSessionId: null,
  }
  console.log(`[auth/signup] ${key} — total users: ${Object.keys(users).length}`)
  res.json({ success: true, user: { email: key, tier: 'free' } })
})

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.json({ success: false, error: 'Email and password required.' })
  const key = email.trim().toLowerCase()
  console.log(`[auth/login] attempt: ${key} — known: ${Object.keys(users).join(', ')}`)

  if (key === ADMIN_EMAIL && password.trim() === 'Admin123') {
    return res.json({ success: true, user: { email: key, tier: 'admin', subscriptionActive: true } })
  }

  let user = users[key]
  if (!user) return res.json({ success: false, error: 'No account found with that email.' })
  if (user.password !== password.trim()) return res.json({ success: false, error: 'Incorrect password. Try again.' })

  user = expireIfNeeded(user)
  console.log(`[auth/login] success: ${key} tier=${user.tier}`)
  res.json({ success: true, user: { email: user.email, tier: user.tier, subscriptionEnd: user.subscriptionEnd, subscriptionActive: user.subscriptionActive } })
})

app.post('/auth/get-user', (req, res) => {
  const { email } = req.body
  if (!email) return res.json({ success: false })
  const key = email.trim().toLowerCase()
  if (key === ADMIN_EMAIL) return res.json({ success: true, user: { email: key, tier: 'admin', subscriptionActive: true } })
  let user = users[key]
  if (!user) return res.json({ success: false })
  user = expireIfNeeded(user)
  res.json({ success: true, user: { email: user.email, tier: user.tier, subscriptionEnd: user.subscriptionEnd, subscriptionActive: user.subscriptionActive } })
})

app.post('/auth/update-tier', (req, res) => {
  const { email, tier, stripeSessionId } = req.body
  if (!email || !tier) return res.json({ success: false, error: 'Missing fields.' })
  const key = email.trim().toLowerCase()
  const now = Date.now()
  if (users[key]) {
    users[key].tier = tier; users[key].subscriptionActive = true
    users[key].subscriptionStart = now; users[key].subscriptionEnd = now + THIRTY_DAYS
    users[key].paidAt = now; users[key].stripeSessionId = stripeSessionId
    users[key].graceUntil = null; users[key].expiredAt = null
  } else {
    users[key] = { email: key, password: null, tier, createdAt: now, subscriptionActive: true, subscriptionStart: now, subscriptionEnd: now + THIRTY_DAYS, paidAt: now, stripeSessionId, needsPassword: true }
  }
  console.log(`[auth/update-tier] ${key} → ${tier}`)
  res.json({ success: true })
})

app.post('/auth/set-password', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.json({ success: false, error: 'Missing fields.' })
  const key = email.trim().toLowerCase()
  if (!users[key]) return res.json({ success: false, error: 'Account not found.' })
  users[key].password = password.trim(); users[key].needsPassword = false
  res.json({ success: true })
})

app.get('/auth/admin/users', (req, res) => {
  if (req.query.adminEmail?.toLowerCase() !== ADMIN_EMAIL) return res.status(401).json({ error: 'Unauthorized' })
  res.json({ success: true, users: Object.values(users) })
})

app.post('/auth/admin/update-user', (req, res) => {
  if (req.body.adminEmail?.toLowerCase() !== ADMIN_EMAIL) return res.status(401).json({ error: 'Unauthorized' })
  const { email, tier, action } = req.body
  const key = email.trim().toLowerCase()
  if (!users[key]) return res.json({ success: false, error: 'User not found.' })
  const now = Date.now()
  if (action === 'extend') {
    const base = users[key].subscriptionEnd && users[key].subscriptionEnd > now ? users[key].subscriptionEnd : now
    users[key].subscriptionEnd = base + THIRTY_DAYS; users[key].subscriptionActive = true
    users[key].graceUntil = null; users[key].expiredAt = null
  } else if (action === 'lifetime') {
    users[key].subscriptionEnd = new Date('2099-01-01').getTime()
    users[key].subscriptionActive = true; users[key].graceUntil = null; users[key].expiredAt = null
  } else if (action === 'reset') {
    users[key].tier = 'free'; users[key].subscriptionActive = false; users[key].expiredAt = now
  } else if (tier) {
    users[key].tier = tier
    if (tier !== 'free') { users[key].subscriptionEnd = now + THIRTY_DAYS; users[key].subscriptionActive = true }
  }
  res.json({ success: true })
})

// ─── Routes ──────────────────────────────────────────────────────────────────

app.post('/create-checkout-session', async (req, res) => {
  const { plan, email } = req.body
  const priceId  = PRICE_IDS()[plan]
  if (!priceId) return res.status(400).json({ error: 'Invalid plan' })

  try {
    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.CLIENT_URL}/#plans`,
      metadata: { plan },
    }
    if (email) sessionParams.customer_email = email
    const session = await stripe.checkout.sessions.create(sessionParams)
    res.json({ url: session.url })
  } catch (err) {
    console.error('create-checkout-session:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/verify-session', async (req, res) => {
  const { session_id } = req.query
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' })

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription', 'subscription.items.data.price'],
    })

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not confirmed' })
    }

    const priceId = session.subscription.items.data[0].price.id
    const tier    = PLAN_NAMES()[priceId]
    if (!tier) return res.status(400).json({ error: 'Unknown plan' })

    res.json({
      tier,
      planDisplay:    PLAN_DISPLAY[tier],
      subscriptionId: session.subscription.id,
      customerEmail:  session.customer_details?.email || '',
      content:        getMemberContent(tier),
    })
  } catch (err) {
    console.error('verify-session:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/subscription-status', async (req, res) => {
  const { sub_id } = req.query
  if (!sub_id) return res.status(400).json({ error: 'Missing sub_id' })

  try {
    const subscription = await stripe.subscriptions.retrieve(sub_id, {
      expand: ['items.data.price'],
    })

    if (!['active', 'trialing'].includes(subscription.status)) {
      return res.status(402).json({ error: 'Subscription not active', status: subscription.status })
    }

    const priceId = subscription.items.data[0].price.id
    const tier    = PLAN_NAMES()[priceId]
    if (!tier) return res.status(400).json({ error: 'Unknown plan' })

    res.json({
      tier,
      planDisplay:    PLAN_DISPLAY[tier],
      subscriptionId: sub_id,
      content:        getMemberContent(tier),
    })
  } catch (err) {
    console.error('subscription-status:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.post('/create-portal-session', async (req, res) => {
  const { subscription_id } = req.body
  if (!subscription_id) return res.status(400).json({ error: 'Missing subscription_id' })

  try {
    const subscription = await stripe.subscriptions.retrieve(subscription_id)
    const portalSession = await stripe.billingPortal.sessions.create({
      customer:   subscription.customer,
      return_url: `${process.env.CLIENT_URL}/dashboard`,
    })
    res.json({ url: portalSession.url })
  } catch (err) {
    console.error('create-portal-session:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/restore-access', async (req, res) => {
  const { email } = req.query
  if (!email) return res.status(400).json({ error: 'Missing email' })
  try {
    const customers = await stripe.customers.list({ email, limit: 1 })
    if (!customers.data.length) return res.json({ found: false })
    const customerId = customers.data[0].id
    const subs = await stripe.subscriptions.list({
      customer: customerId, status: 'active', limit: 1,
      expand: ['data.items.data.price'],
    })
    if (!subs.data.length) return res.json({ found: false })
    const priceId = subs.data[0].items.data[0].price.id
    const tier    = PLAN_NAMES()[priceId]
    if (!tier) return res.json({ found: false })
    res.json({ found: true, tier, planDisplay: PLAN_DISPLAY[tier], email })
  } catch (err) {
    console.error('restore-access:', err.message)
    res.status(500).json({ error: err.message })
  }
})

const ADMIN_EMAIL = 'jahwick399@gmail.com'

app.get('/admin-member-content', (req, res) => {
  if (req.query.email?.toLowerCase() !== ADMIN_EMAIL) return res.status(401).json({ error: 'Unauthorized' })
  res.json({
    tier: 'admin',
    planDisplay: '👑 Admin',
    subscriptionId: 'admin',
    customerEmail: req.query.email,
    content: getMemberContent('pro'),
  })
})

app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  console.log(`Stripe event: ${event.type}`)
  res.json({ received: true })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Flip Labs server running on port ${PORT}`))
