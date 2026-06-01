import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { COURSE_MODULES, canAccess } from '../data/courseContent'
import { SUPPLIER_MODULES } from '../data/supplierContent'
import { ALL_VENDORS } from '../data/vendorData'
import { MILESTONES } from '../data/milestones'
import { getSession, clearSession, getUsers, updateUserTier } from '../utils/auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const TABS = [
  { id: 'home',       label: 'Home',      icon: '🏠' },
  { id: 'vendors',    label: 'Vendors',   icon: '🏪' },
  { id: 'learn',      label: 'Learn',     icon: '📚' },
  { id: 'supplier',   label: 'Supplier',  icon: '🏭' },
  { id: 'tools',      label: 'Tools',     icon: '🛠️' },
  { id: 'milestones', label: 'Progress',  icon: '🏆' },
  { id: 'account',    label: 'Account',   icon: '👤' },
]

const TIER_COLOR = {
  free:         { bg: 'rgba(255,255,255,0.06)',  border: 'rgba(255,255,255,0.2)',  text: 'rgba(255,255,255,0.55)' },
  beginner:     { bg: 'rgba(96,165,250,0.15)',   border: 'rgba(96,165,250,0.4)',   text: '#60a5fa' },
  intermediate: { bg: 'rgba(255,215,0,0.12)',    border: 'rgba(255,215,0,0.45)',   text: '#FFD700' },
  pro:          { bg: 'rgba(196,132,252,0.15)',  border: 'rgba(196,132,252,0.4)',  text: '#c084fc' },
  admin:        { bg: 'rgba(255,215,0,0.18)',    border: 'rgba(255,215,0,0.6)',    text: '#FFD700' },
}

const FREE_MEMBER = {
  tier: 'free',
  planDisplay: 'Free Plan',
  subscriptionId: null,
  customerEmail: '',
  content: {
    categories: [],
    lockedCategories: [
      { id: 'electronics', name: 'Electronics', icon: '📱', tier: 'beginner' },
      { id: 'fragrance',   name: 'Fragrance',   icon: '🌹', tier: 'beginner' },
      { id: 'clothing',    name: 'Clothing',     icon: '👕', tier: 'beginner' },
      { id: 'shoes',       name: 'Shoes',        icon: '👟', tier: 'intermediate' },
      { id: 'jewelry',     name: 'Jewelry',      icon: '💎', tier: 'intermediate' },
      { id: 'watches',     name: 'Watches',      icon: '⌚', tier: 'intermediate' },
    ],
    guides: [],
  },
}

const FREE_VENDOR_LINKS = [
  { name: 'Jewelry Vendor 1', url: 'https://jewelryresell.com',        category: 'Jewelry' },
  { name: 'Jewelry Vendor 2', url: 'https://www.moissanitesupply.net', category: 'Jewelry' },
]

const DAILY_TIPS = [
  'Always check sold listings before you buy anything',
  'Price slightly under competitors to move inventory faster',
  'List in the morning — buyers browse more in the evening',
  'Always include measurements in clothing listings',
  'Use natural lighting for product photos whenever possible',
  'Respond to buyer messages within an hour to close faster',
  "Never let inventory sit more than 30 days — drop the price",
  'Reinvest at least 70% of every sale back into new inventory',
  'The best time to sell electronics is October through December',
  'Fragrance sells best around Valentine\'s Day and the holidays',
  'Shoes sell fastest in size 9-11 range — source those first',
  'Bundle slow-moving items with fast-moving ones to clear stock',
  'Always ship within 24 hours — it builds your seller rating fast',
  'Take at least 4 photos per listing — front, back, tag, detail',
  'Use keywords buyers actually search — be specific not generic',
  'Free shipping listings get more clicks — factor it into your price',
  'Check your competition every week — prices change constantly',
  'A great listing title is worth more than a great photo',
  'Start with one platform and master it before adding more',
  'Your packaging is part of the experience — make it clean',
  'Track every purchase and sale from day one — you\'ll thank yourself',
  "Never buy more than you can sell in 2 weeks when starting out",
  'Offer a small discount to buyers who message — it closes deals',
  'Clothing in good condition always sells — condition is everything',
  'Electronics with original packaging sell for 20-30% more',
  'The faster you relist unsold items, the more views you get',
  'Cross-list every item on at least 2 platforms simultaneously',
  'Set a weekly listing goal and stick to it no matter what',
  'Your first sale is the hardest — every one after gets easier',
  'Treat this like a business from day one and it will become one',
]

// ─── Plan / upgrade data ─────────────────────────────────────────────────────

const PLAN_PRICES = { beginner: '$14.99/mo', intermediate: '$29.99/mo', pro: '$49.99/mo' }
const TIER_NEXT   = { free: 'beginner', beginner: 'intermediate', intermediate: 'pro' }

const UPGRADE_FEATURES = {
  beginner:     ['Electronics, Fragrance & Clothing vendors', 'Full listing templates for every category', '$0 to $500 milestone action plan', 'Packaging, shipping & carrier guide'],
  intermediate: ['ALL 7 vendor categories unlocked', 'Bulk flipping guide — buy 5–20 units', 'eBay SEO deep dive + Depop algorithm guide', 'Built-in profit margin calculator'],
  pro:          ['Exclusive Pro-only vendor drops', 'LLC setup + business bank account guide', '$1,000/week step-by-step roadmap', 'Monthly income goal tracker + profit journal'],
}

const WINS_FEED_DATA = [
  { name: 'Jordan M.',   location: 'Atlanta, GA',      plan: 'Pro Plan' },
  { name: 'Marcus L.',   location: 'New York, NY',     plan: 'Intermediate Plan' },
  { name: 'Chris R.',    location: 'Chicago, IL',      plan: 'Beginner Plan' },
  { name: 'Malik T.',    location: 'Houston, TX',      plan: 'Pro Plan' },
  { name: 'Darius F.',   location: 'Dallas, TX',       plan: 'Intermediate Plan' },
  { name: 'Andre S.',    location: 'Miami, FL',        plan: 'Beginner Plan' },
  { name: 'Devon A.',    location: 'Los Angeles, CA',  plan: 'Pro Plan' },
  { name: 'Brandon H.',  location: 'Philadelphia, PA', plan: 'Intermediate Plan' },
  { name: 'Jaylen T.',   location: 'Seattle, WA',      plan: 'Beginner Plan' },
  { name: 'Tyler J.',    location: 'Phoenix, AZ',      plan: 'Pro Plan' },
]

const SEVEN_DAYS = [
  'Set up accounts on eBay, Depop, and Facebook Marketplace',
  'Find 5 items around your house to sell. List them today.',
  'Research your first vendor category — check sold listings',
  'Place your first vendor order',
  'Photograph everything. Write all your listings.',
  'Post all listings across every platform you set up',
  'Follow up on any messages. Adjust prices if needed.',
]

const LISTING_CHECKLIST = [
  'Item is clean and presentable',
  'Took at least 4 photos (front, back, detail, tag)',
  'Photos have a clean neutral background',
  'Checked sold listings to confirm my price is right',
  'Title includes brand, item name, size, color, condition',
  'Description answers: condition, measurements, any flaws',
  'Platform fees calculated — I know my exact profit',
  'Shipping cost calculated and included or listed separately',
  'Listed on at least 2 platforms',
  'Offers enabled on listing',
  'Responded to any existing messages on other listings',
]

const GLOSSARY = [
  { term: 'Flip',             def: 'Buying something low and selling it higher for profit' },
  { term: 'Vendor',           def: 'A supplier you buy products from to resell' },
  { term: 'Margin',           def: 'The difference between what you paid and what you sold for' },
  { term: 'ROI',              def: 'Return on investment — how much you made back vs what you spent' },
  { term: 'Cross-listing',    def: 'Listing the same item on multiple platforms at once' },
  { term: 'Dead stock',       def: 'Inventory that isn\'t selling and is sitting too long' },
  { term: 'Comp',             def: 'A comparable sold listing used to determine your price' },
  { term: 'Bundle',           def: 'Combining multiple items into one listing to increase value' },
  { term: 'Lowball',          def: 'A buyer offer that is way below your asking price' },
  { term: 'Chargeback',       def: 'When a buyer disputes a payment through their bank' },
  { term: 'Sell-through rate',def: 'How fast your inventory sells' },
  { term: 'OBO',              def: 'Or Best Offer — seller is open to negotiation' },
  { term: 'NWT',              def: 'New With Tags — item is brand new with original tags' },
  { term: 'NWOT',             def: 'New Without Tags — new but tags removed' },
  { term: 'GUC',              def: 'Good Used Condition' },
  { term: 'Platform fee',     def: 'The percentage a platform takes from your sale' },
  { term: 'Payout',           def: 'The money you actually receive after fees' },
  { term: 'Relisting',        def: 'Taking down and reposting a listing to refresh it' },
  { term: 'Sourcing',         def: 'The process of finding products to buy and resell' },
  { term: 'Liquidation',      def: 'Buying bulk returned or excess inventory cheaply' },
]

const PLATFORMS_DATA = [
  { name: 'eBay',       bestFor: 'Electronics, collectibles', fee: '13%',           shipping: 'Flexible', payout: '2–3 days',         difficulty: 'Moderate',  buyers: '35–55', pro: 'Massive buyer base',        con: 'Higher fees, more competition' },
  { name: 'Depop',      bestFor: 'Streetwear, vintage',       fee: '10% + PayPal',  shipping: 'Flexible', payout: 'Instant via PayPal', difficulty: 'Easy',      buyers: '16–30', pro: 'Young trendy buyers',        con: 'Clothing-focused only' },
  { name: 'FB Market',  bestFor: 'Furniture, local deals',    fee: '0% local / 5%', shipping: 'Local/ship', payout: 'Cash or instant', difficulty: 'Easy',      buyers: '25–50', pro: 'No fees for local sales',    con: 'Lowball offers common' },
  { name: 'Poshmark',   bestFor: 'Clothing, accessories',     fee: '20%',           shipping: 'Buyer pays', payout: '3 days post-delivery', difficulty: 'Easy', buyers: '18–40', pro: 'Built-in shipping label',    con: 'Very high seller fee' },
  { name: 'Mercari',    bestFor: 'General merchandise',       fee: '10%',           shipping: 'Flexible', payout: '3 days post-delivery', difficulty: 'Very Easy', buyers: '20–45', pro: 'Simple and beginner-friendly', con: 'Smaller buyer base' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function PlanBadge({ tier, planDisplay }) {
  const c = TIER_COLOR[tier] || TIER_COLOR.beginner
  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-body font-bold tracking-wide"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      {planDisplay}
    </span>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-dark font-display text-sm flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,#FFE566,#FFD700,#FFA500)', boxShadow: '0 0 10px rgba(255,215,0,0.4)' }}>
        F
      </div>
      <span className="font-display text-lg tracking-wider leading-none">
        <span className="gold-text">FLIP</span>
        <span className="text-white"> LABS</span>
      </span>
    </div>
  )
}

// ─── Vendor section ───────────────────────────────────────────────────────────

const CAT_META = {
  Electronics: { icon: '📱' },
  Fragrance:   { icon: '🌹' },
  Clothing:    { icon: '👕' },
  Shoes:       { icon: '👟' },
  Jewelry:     { icon: '💎' },
  Watches:     { icon: '⌚' },
}
const CAT_ORDER = ['Electronics', 'Fragrance', 'Clothing', 'Shoes', 'Jewelry', 'Watches']

function canAccessVendor(vendorTier, userTier) {
  if (vendorTier === 'free') return true
  if (userTier === 'admin' || userTier === 'pro') return true
  if (userTier === 'intermediate') return vendorTier === 'beginner' || vendorTier === 'intermediate'
  if (userTier === 'beginner') return vendorTier === 'beginner'
  return false
}

function VendorCard({ vendor, userTier, showCategory }) {
  const accessible = canAccessVendor(vendor.tier, userTier)
  const tierBadge  = vendor.tier === 'intermediate'
    ? { bg: 'rgba(255,215,0,0.12)',   text: '#FFD700',  border: 'rgba(255,215,0,0.3)',   label: 'INTERMEDIATE' }
    : vendor.tier === 'beginner'
    ? { bg: 'rgba(96,165,250,0.12)',  text: '#60a5fa',  border: 'rgba(96,165,250,0.3)',  label: 'BEGINNER' }
    : { bg: 'rgba(52,211,153,0.12)',  text: '#34d399',  border: 'rgba(52,211,153,0.3)',  label: 'FREE' }

  const icon = CAT_META[vendor.category]?.icon || '🏪'

  if (!accessible) {
    const price    = PLAN_PRICES[vendor.tier] || '$29.99/mo'
    const planName = vendor.tier.charAt(0).toUpperCase() + vendor.tier.slice(1)
    return (
      <div className="rounded-2xl overflow-hidden relative select-none"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', minHeight: 108 }}>
        {/* blurred content */}
        <div className="p-4 flex flex-col gap-3" style={{ filter: 'blur(5px)', pointerEvents: 'none' }}>
          <div className="font-body font-semibold text-white text-sm">{vendor.name}</div>
          {vendor.price && (
            <span className="text-xs font-body font-bold px-2 py-0.5 rounded-full w-fit"
              style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>{vendor.price}</span>
          )}
          <div className="w-full py-2.5 rounded-full text-xs font-body font-bold text-center"
            style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700' }}>Access Vendor →</div>
        </div>
        {/* lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3">
          <span className="text-2xl">🔒</span>
          <span className="text-[10px] font-body font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ background: tierBadge.bg, color: tierBadge.text, border: `1px solid ${tierBadge.border}` }}>
            {planName} — {price}
          </span>
          <a href="/#plans"
            className="px-3 py-1.5 rounded-full text-xs font-body font-bold whitespace-nowrap mt-1"
            style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}>
            Upgrade →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,215,0,0.1)', minHeight: 108 }}>
      <div className="flex-1 min-w-0">
        <div className="font-body font-semibold text-white text-sm leading-snug">{vendor.name}</div>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {vendor.price && (
            <span className="text-xs font-body font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
              {vendor.price}
            </span>
          )}
          {vendor.subcategory && (
            <span className="text-[10px] font-body px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {vendor.subcategory}
            </span>
          )}
          {showCategory && (
            <span className="text-[10px] font-body px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(255,215,0,0.08)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {icon} {vendor.category}
            </span>
          )}
        </div>
      </div>
      <a href={vendor.url} target="_blank" rel="noopener noreferrer"
        className="w-full py-2.5 rounded-full text-xs font-body font-bold text-center flex items-center justify-center min-h-[36px]"
        style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700' }}>
        Access Vendor →
      </a>
    </div>
  )
}

function CategoryAccordion({ category, vendors, userTier, index }) {
  const [open, setOpen] = useState(false)
  const icon       = CAT_META[category]?.icon || '🏪'
  const allLocked  = vendors.every(v => !canAccessVendor(v.tier, userTier))
  const catTier    = vendors[0]?.tier || 'beginner'
  const tierBadge  = catTier === 'intermediate'
    ? { bg: 'rgba(255,215,0,0.12)',  text: '#FFD700', border: 'rgba(255,215,0,0.3)',  label: 'INTERMEDIATE' }
    : { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.3)', label: 'BEGINNER' }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: open ? '1px solid rgba(255,215,0,0.35)' : '1px solid rgba(255,215,0,0.1)', background: open ? 'rgba(255,215,0,0.02)' : 'rgba(255,255,255,0.02)' }}>
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-4 text-left min-h-[56px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)' }}>{icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-body font-semibold text-white text-sm">{category}</span>
              {allLocked && (
                <span className="text-[10px] font-body font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ background: tierBadge.bg, color: tierBadge.text, border: `1px solid ${tierBadge.border}` }}>
                  {tierBadge.label}
                </span>
              )}
            </div>
            <div className="text-white/30 font-body text-xs">{vendors.length} supplier{vendors.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-white/30 text-xs pr-1">▼</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {vendors.map(v => <VendorCard key={v.id} vendor={v} userTier={userTier} showCategory={false} />)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function VendorsSection({ member }) {
  const [search, setSearch] = useState('')
  const userTier = member.tier

  useEffect(() => {
    console.log('Vendors loaded:', ALL_VENDORS.length)
  }, [])

  const freeVendors = ALL_VENDORS.filter(v => v.tier === 'free')
  const paidVendors = ALL_VENDORS.filter(v => v.tier !== 'free')

  const q = search.trim().toLowerCase()
  const searchResults = q.length > 1
    ? paidVendors.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        (v.subcategory || '').toLowerCase().includes(q)
      )
    : null

  const categoriesInOrder = CAT_ORDER.filter(cat => paidVendors.some(v => v.category === cat))

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl sm:text-3xl text-white mb-1">My <span className="gold-text">Vendors</span></h2>
        <p className="text-white/40 font-body text-sm">Tap any category to see suppliers. Use search to find by name.</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search vendors by name…"
          className="w-full px-4 py-3 pr-10 rounded-xl font-body text-sm text-white placeholder-white/20 outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 w-6 h-6 flex items-center justify-center text-xs">
            ✕
          </button>
        )}
      </motion.div>

      {/* Search results */}
      {searchResults !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {searchResults.length === 0 ? (
            <p className="text-white/30 font-body text-sm text-center py-6">No vendors match "{search}"</p>
          ) : (
            <>
              <p className="text-white/30 font-body text-xs">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {searchResults.map(v => <VendorCard key={v.id} vendor={v} userTier={userTier} showCategory />)}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Normal view */}
      {searchResults === null && (
        <>
          {/* All Vendors spreadsheets — Intermediate/Pro/Admin only */}
          {(userTier === 'intermediate' || userTier === 'pro' || userTier === 'admin') && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="mb-3">
                <h3 className="font-display text-lg text-white">
                  📋 All <span className="gold-text" style={{ borderBottom: '2px solid #FFD700', paddingBottom: 1 }}>Vendors</span>
                </h3>
                <p className="text-white/35 font-body text-xs mt-1">Full supplier catalog — everything in one place</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: '📊',
                    title: 'Master Vendor Spreadsheet',
                    desc: 'Full catalog of every vendor across all categories',
                    url: 'https://docs.google.com/spreadsheets/d/1a3R_v5FiirNsIWx6JJrVCaWPUOj1wFD2vhCLilk1hAg/htmlview?utm_source=ig&utm_medium=social&utm_content=link_in_bio',
                  },
                  {
                    icon: '📋',
                    title: 'Extended Vendor List',
                    desc: 'Additional vendors and supplier links updated regularly',
                    url: 'https://docs.google.com/spreadsheets/d/1bEDyU7BJ8sNstmoXJa_IPb4FR_9uTFl6-hepzlt0Ad4/edit?gid=595104429#gid=595104429',
                  },
                ].map((card, i) => (
                  <div key={i} className="rounded-2xl p-5 flex flex-col gap-3"
                    style={{
                      background: 'rgba(255,215,0,0.03)',
                      border: '1px solid rgba(255,215,0,0.25)',
                      boxShadow: '0 0 18px rgba(255,215,0,0.06)',
                    }}>
                    <div className="text-2xl leading-none">{card.icon}</div>
                    <div className="flex-1">
                      <div className="font-body font-semibold text-white text-sm leading-snug mb-1">{card.title}</div>
                      <div className="text-white/40 font-body text-xs">{card.desc}</div>
                    </div>
                    <a href={card.url} target="_blank" rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-full text-xs font-body font-bold text-center flex items-center justify-center gap-1.5 min-h-[36px]"
                      style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}>
                      Open Spreadsheet ↗
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Free vendors */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="rounded-2xl p-4" style={{ background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.2)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-body font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>FREE</span>
              <h3 className="font-display text-base text-white">Free Vendors — Start Here 💎</h3>
            </div>
            <p className="text-white/35 font-body text-xs mb-4">These are yours free. No payment needed.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {freeVendors.map(v => (
                <div key={v.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.12)' }}>
                  <div>
                    <div className="text-white/80 font-body text-sm font-semibold">{v.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-body font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>FREE</span>
                      <span className="text-white/30 font-body text-xs">{v.category}</span>
                    </div>
                  </div>
                  <a href={v.url} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 px-3 py-2 rounded-full text-xs font-body font-bold min-h-[36px] flex items-center"
                    style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}>
                    Access Vendor →
                  </a>
                </div>
              ))}
            </div>
          </motion.div>

          {/* All paid categories */}
          <div className="space-y-3">
            {categoriesInOrder.map((cat, i) => (
              <CategoryAccordion
                key={cat}
                category={cat}
                vendors={paidVendors.filter(v => v.category === cat)}
                userTier={userTier}
                index={i}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Learn section ────────────────────────────────────────────────────────────

function LessonModal({ lesson, module: mod, allLessons, lessonIndex, onClose, onComplete, isCompleted, onNextLesson }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const hasNext = lessonIndex < allLessons.length - 1

  const CAT_COLORS = {
    Mindset:    { bg: 'rgba(196,132,252,0.15)', text: '#c084fc' },
    Strategy:   { bg: 'rgba(255,215,0,0.12)',   text: '#FFD700' },
    Income:     { bg: 'rgba(52,211,153,0.12)',   text: '#34d399' },
    Listings:   { bg: 'rgba(96,165,250,0.12)',   text: '#60a5fa' },
    Vendors:    { bg: 'rgba(251,146,60,0.12)',   text: '#fb923c' },
    Pricing:    { bg: 'rgba(255,215,0,0.12)',    text: '#FFD700' },
    Platforms:  { bg: 'rgba(96,165,250,0.12)',   text: '#60a5fa' },
    Finance:    { bg: 'rgba(52,211,153,0.12)',   text: '#34d399' },
    Operations: { bg: 'rgba(251,146,60,0.12)',   text: '#fb923c' },
    SEO:        { bg: 'rgba(196,132,252,0.15)', text: '#c084fc' },
    Research:   { bg: 'rgba(255,215,0,0.12)',    text: '#FFD700' },
    Scaling:    { bg: 'rgba(255,215,0,0.12)',    text: '#FFD700' },
    Branding:   { bg: 'rgba(196,132,252,0.15)', text: '#c084fc' },
  }

  const catStyle = CAT_COLORS[lesson.category] || { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.5)' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        className="w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{ background: '#0f0f0f', border: '1px solid rgba(255,215,0,0.15)', maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,215,0,0.1)' }}>
          <div className="flex-1 pr-4">
            <div className="text-white/35 font-body text-xs mb-1">{mod.icon} {mod.title}</div>
            <h2 className="font-display text-xl sm:text-2xl text-white leading-tight">{lesson.title}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-white/30 font-body text-xs">📖 {lesson.readTime} read</span>
              {lesson.category && (
                <span className="px-2 py-0.5 rounded-full text-xs font-body font-semibold"
                  style={{ background: catStyle.bg, color: catStyle.text }}>
                  {lesson.category}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)' }}>✕</button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Hook */}
          <p className="font-body font-bold text-white text-base leading-snug">{lesson.hook}</p>

          {/* The Point */}
          <div>
            <div className="text-white/25 font-body text-[10px] uppercase tracking-widest mb-1">The Point</div>
            <p className="text-white/60 font-body text-sm leading-relaxed">{lesson.point}</p>
          </div>

          {/* Key Steps */}
          <div>
            <div className="text-white/25 font-body text-[10px] uppercase tracking-widest mb-2">Key Steps</div>
            <ul className="space-y-2">
              {lesson.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-display mt-0.5"
                    style={{ background: 'rgba(255,215,0,0.12)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.25)' }}>
                    {i + 1}
                  </span>
                  <span className="text-white/65 font-body text-sm leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Tip */}
          <div className="rounded-xl p-3.5 flex items-start gap-3"
            style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)' }}>
            <span className="text-lg flex-shrink-0">💡</span>
            <div>
              <div className="text-white/35 font-body text-[10px] uppercase tracking-widest mb-1">Pro Tip</div>
              <p className="font-body text-sm font-semibold leading-snug" style={{ color: '#FFD700' }}>{lesson.proTip}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex-shrink-0 flex flex-col gap-3" style={{ borderColor: 'rgba(255,215,0,0.1)' }}>
          {isCompleted ? (
            <div className="flex items-center justify-center gap-2 py-3 rounded-full font-body font-bold text-sm"
              style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}>
              ✅ Completed
            </div>
          ) : (
            <button onClick={() => onComplete(lesson.id)}
              className="w-full py-3.5 rounded-full font-body font-bold text-sm text-dark btn-gold min-h-[48px]">
              Mark Complete ✓
            </button>
          )}
          {hasNext && (
            <button onClick={() => { onNextLesson(lessonIndex + 1) }}
              className="w-full py-3 rounded-full font-body font-semibold text-sm min-h-[44px]"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
              Next Lesson →
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function ModuleCard({ mod, userTier, completed, onSelectLesson }) {
  const [open, setOpen] = useState(false)
  const locked = !canAccess(mod.tier, userTier)
  const totalLessons = mod.lessons.length
  const completedCount = mod.lessons.filter(l => completed.has(l.id)).length

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden"
      style={{ border: locked ? '1px solid rgba(255,255,255,0.06)' : open ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,215,0,0.12)' }}>
      <button onClick={() => !locked && setOpen(v => !v)}
        className="w-full flex items-center gap-4 px-4 py-4 text-left min-h-[64px] active:scale-[0.99] transition-transform"
        style={{ background: open ? 'rgba(255,215,0,0.04)' : 'rgba(255,255,255,0.02)' }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: locked ? 'rgba(255,255,255,0.05)' : 'rgba(255,215,0,0.08)', border: locked ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,215,0,0.2)' }}>
          {locked ? '🔒' : mod.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-body font-semibold text-sm leading-tight" style={{ color: locked ? 'rgba(255,255,255,0.3)' : 'white' }}>{mod.title}</div>
          <div className="text-white/25 font-body text-xs mt-0.5">
            {locked ? 'Upgrade to unlock' : `${completedCount}/${totalLessons} lessons${completedCount === totalLessons && totalLessons > 0 ? ' ✅' : ''}`}
          </div>
        </div>
        {!locked && <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-white/30 text-xs flex-shrink-0">▼</motion.span>}
        {locked && (
          <a href="/#plans" onClick={e => e.stopPropagation()}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-bold min-h-[36px] flex items-center whitespace-nowrap"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>
            {mod.tier.charAt(0).toUpperCase() + mod.tier.slice(1)} — {PLAN_PRICES[mod.tier]}
          </a>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && !locked && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="pb-3 space-y-1">
              {mod.lessons.map((lesson, li) => (
                <button key={lesson.id} onClick={() => onSelectLesson(lesson, mod)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors min-h-[52px]">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                    style={completed.has(lesson.id) ? { background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.4)', color: '#34d399' } : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                    {completed.has(lesson.id) ? '✓' : li + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/70 font-body text-sm leading-tight truncate">{lesson.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-white/25 font-body text-xs">{lesson.readTime}</span>
                      {lesson.category && (
                        <span className="text-[10px] font-body text-white/30 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>{lesson.category}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-white/25 text-xs flex-shrink-0">›</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Supplier section ─────────────────────────────────────────────────────────

const SUPPLIER_TOOLS = [
  {
    id: 'profit-calc',
    title: 'Supplier Profit Calculator',
    icon: '🧮',
    component: function SupplierCalc() {
      const [cost,  setCost]  = useState('')
      const [units, setUnits] = useState('')
      const [sell,  setSell]  = useState('')
      const inv   = parseFloat(cost)  * parseFloat(units)  || 0
      const rev   = parseFloat(sell)  * parseFloat(units)  || 0
      const profit = rev - inv
      const roi    = inv > 0 ? ((profit / inv) * 100).toFixed(0) : 0
      const breakEven = parseFloat(sell) > 0 ? Math.ceil(inv / parseFloat(sell)) : 0
      return (
        <div className="space-y-3">
          {[
            { label: 'Cost per unit ($)', val: cost,  set: setCost },
            { label: 'Units ordered',    val: units, set: setUnits },
            { label: 'Sell price per access ($)', val: sell, set: setSell },
          ].map(f => (
            <div key={f.label}>
              <label className="text-white/40 font-body text-xs uppercase tracking-widest block mb-1">{f.label}</label>
              <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder="0"
                className="w-full px-3 py-2 rounded-xl font-body text-sm text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
          ))}
          {inv > 0 && (
            <div className="rounded-xl p-4 mt-2 space-y-1.5" style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}>
              {[
                ['Total investment', `$${inv.toFixed(2)}`],
                ['Total revenue',    `$${rev.toFixed(2)}`],
                ['Profit',           `$${profit.toFixed(2)}`],
                ['ROI',              `${roi}%`],
                ['Break-even at',    `${breakEven} customers`],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span className="text-white/40 font-body text-xs">{l}</span>
                  <span className="font-body text-xs font-bold" style={{ color: '#FFD700' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
  },
]

const SUPPLIER_RESOURCES = [
  { name: '1688.com',       desc: 'Chinese wholesale',          url: 'https://1688.com' },
  { name: 'DHgate.com',     desc: 'Low MOQ wholesale',          url: 'https://www.dhgate.com' },
  { name: 'Alibaba.com',    desc: 'Global suppliers',           url: 'https://www.alibaba.com' },
  { name: 'Gumroad.com',    desc: 'Sell digital products',      url: 'https://gumroad.com' },
  { name: 'Payhip.com',     desc: 'Sell digital products',      url: 'https://payhip.com' },
  { name: 'Canva.com',      desc: 'Design your brand',          url: 'https://www.canva.com' },
  { name: 'Beacons.ai',     desc: 'Link in bio storefront',     url: 'https://beacons.ai' },
]

const LAUNCH_CHECKLIST_ITEMS = [
  'Found and tested at least 5 vendor links',
  'Organized links into a clean Google Sheet',
  'Set up payment method (Stripe, Gumroad, Payhip)',
  'Built a simple sales page or link in bio',
  'Got at least 1 person to review the product',
  'Posted about it on at least 1 social platform',
  'Set up automatic delivery after payment',
  'Created a way for buyers to contact you',
]

const PRICE_GUIDE = [
  { label: 'Single category link',       range: '$5 – $15' },
  { label: 'Category bundle (3-5 links)', range: '$15 – $30' },
  { label: 'Full access monthly',         range: '$20 – $50' },
  { label: 'One-time all access',         range: '$50 – $100' },
]

function SupplierSection({ userTier }) {
  const isPaid = userTier && userTier !== 'free'
  const [activeLesson, setActiveLesson] = useState(null)
  const [activeMod,    setActiveMod]    = useState(null)
  const [completed,    setCompleted]    = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('fl_supplier_done') || '[]')) } catch { return new Set() }
  })
  const [launchChecks, setLaunchChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fl_launch_checks') || '[]') } catch { return [] }
  })

  const toggleCheck = (i) => {
    const next = launchChecks.includes(i) ? launchChecks.filter(x => x !== i) : [...launchChecks, i]
    setLaunchChecks(next)
    localStorage.setItem('fl_launch_checks', JSON.stringify(next))
  }

  const openLesson = (lesson, mod) => { setActiveLesson(lesson); setActiveMod(mod) }
  const closeLesson = () => { setActiveLesson(null); setActiveMod(null) }
  const completeLesson = (id) => {
    const next = new Set(completed).add(id)
    setCompleted(next)
    localStorage.setItem('fl_supplier_done', JSON.stringify([...next]))
  }

  if (!isPaid) {
    return (
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display text-2xl sm:text-3xl text-white mb-1">🏭 <span className="gold-text">Supplier Program</span></h2>
          <p className="text-white/40 font-body text-sm">Learn how to become a vendor yourself.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden relative" style={{ minHeight: 280, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Blurred preview */}
          <div className="p-5 space-y-2" style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}>
            {['The Supplier Mindset', 'Finding Your Suppliers', 'Building Your Operation', 'Scaling Your Business'].map(t => (
              <div key={t} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)' }}>
                <div className="text-white font-body text-sm font-semibold">{t}</div>
                <div className="text-white/30 font-body text-xs mt-0.5">4 lessons</div>
              </div>
            ))}
          </div>
          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="text-3xl">🔒</span>
            <div>
              <p className="text-white font-body font-semibold text-base">This is for paid members only</p>
              <p className="text-white/45 font-body text-sm mt-1">Upgrade to Beginner or higher to access the full Supplier Program</p>
            </div>
            <a href="/#plans" className="btn-gold px-6 py-2.5 rounded-full font-body font-bold text-dark text-sm" style={{ minHeight: 44 }}>
              Upgrade Now →
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  const totalLessons = SUPPLIER_MODULES.reduce((a, m) => a + m.lessons.length, 0)

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl sm:text-3xl text-white mb-1">🏭 <span className="gold-text">Supplier Program</span></h2>
        <p className="text-white/40 font-body text-sm">{completed.size} of {totalLessons} lessons completed.</p>
      </motion.div>

      {/* Modules */}
      <div className="space-y-3">
        {SUPPLIER_MODULES.map((mod, i) => (
          <motion.div key={mod.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <ModuleCard mod={mod} userTier={userTier} completed={completed} onSelectLesson={(l) => openLesson(l, mod)} />
          </motion.div>
        ))}
      </div>

      {/* Tools */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="font-display text-xl text-white mb-3">🛠️ Supplier <span className="gold-text">Tools</span></h3>
        <div className="space-y-3">
          {/* Profit Calculator */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,215,0,0.1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🧮</span>
              <span className="font-body font-semibold text-white text-sm">Supplier Profit Calculator</span>
            </div>
            {(() => { const Calc = SUPPLIER_TOOLS[0].component; return Calc ? <Calc /> : null })()}
          </div>

          {/* Price guide */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,215,0,0.1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💰</span>
              <span className="font-body font-semibold text-white text-sm">Pricing Strategy Guide</span>
            </div>
            <div className="space-y-2">
              {PRICE_GUIDE.map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-white/55 font-body text-xs">{row.label}</span>
                  <span className="font-body text-xs font-bold" style={{ color: '#FFD700' }}>{row.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Launch Checklist */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,215,0,0.1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✅</span>
              <span className="font-body font-semibold text-white text-sm">Launch Checklist</span>
            </div>
            <div className="space-y-2.5">
              {LAUNCH_CHECKLIST_ITEMS.map((item, i) => (
                <button key={i} onClick={() => toggleCheck(i)} className="w-full flex items-start gap-3 text-left">
                  <span className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                    style={{ background: launchChecks.includes(i) ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${launchChecks.includes(i) ? 'rgba(255,215,0,0.5)' : 'rgba(255,255,255,0.15)'}` }}>
                    {launchChecks.includes(i) && <span style={{ color: '#FFD700', fontSize: 10 }}>✓</span>}
                  </span>
                  <span className="font-body text-xs leading-relaxed" style={{ color: launchChecks.includes(i) ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.65)', textDecoration: launchChecks.includes(i) ? 'line-through' : 'none' }}>{item}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resource Links */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="font-display text-xl text-white mb-3">🔗 Free <span className="gold-text">Resources</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUPPLIER_RESOURCES.map(r => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
              style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)' }}>
              <div>
                <div className="font-body font-semibold text-white text-sm">{r.name}</div>
                <div className="text-white/35 font-body text-xs">{r.desc}</div>
              </div>
              <span style={{ color: '#FFD700', fontSize: 14 }}>↗</span>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Lesson modal */}
      <AnimatePresence>
        {activeLesson && activeMod && (
          <LessonModal
            lesson={activeLesson}
            module={activeMod}
            allLessons={activeMod.lessons}
            lessonIndex={activeMod.lessons.indexOf(activeLesson)}
            onClose={closeLesson}
            onComplete={completeLesson}
            isCompleted={completed.has(activeLesson.id)}
            onNextLesson={(next) => { setActiveLesson(next) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Tools section ────────────────────────────────────────────────────────────

function ToolCard({ title, icon, description, tier, userTier, children }) {
  const [open, setOpen] = useState(false)
  const locked = !canAccess(tier, userTier)

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: open ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,215,0,0.1)', background: 'rgba(255,255,255,0.02)' }}>
      <button onClick={() => !locked && setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left min-h-[68px] active:scale-[0.99] transition-transform">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: locked ? 'rgba(255,255,255,0.04)' : 'rgba(255,215,0,0.08)', border: locked ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(255,215,0,0.18)' }}>
          {locked ? '🔒' : icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-body font-semibold text-sm" style={{ color: locked ? 'rgba(255,255,255,0.3)' : 'white' }}>{title}</div>
          <div className="text-white/30 font-body text-xs mt-0.5">{description}</div>
        </div>
        {locked ? (
          <a href="/#plans" onClick={e => e.stopPropagation()} className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-bold min-h-[36px] flex items-center whitespace-nowrap"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>
            {tier.charAt(0).toUpperCase() + tier.slice(1)} — {PLAN_PRICES[tier]}
          </a>
        ) : (
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-white/30 text-xs flex-shrink-0 pr-1">▼</motion.span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && !locked && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
            <div className="px-4 pb-5 pt-3 border-t" style={{ borderColor: 'rgba(255,215,0,0.08)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return (
    <button onClick={copy} className="px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all"
      style={{ background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,215,0,0.1)', border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(255,215,0,0.2)'}`, color: copied ? '#34d399' : '#FFD700' }}>
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function ToolInput({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block text-white/40 font-body text-xs mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm font-body text-white placeholder-white/20 outline-none focus:ring-1"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', focusRingColor: '#FFD700' }}
      />
    </div>
  )
}

// Tool 1: Profit Calculator
function ProfitCalculator() {
  const [cost, setCost]       = useState('')
  const [fees, setFees]       = useState('13')
  const [ship, setShip]       = useState('')
  const [sale, setSale]       = useState('')

  const saleN = parseFloat(sale) || 0
  const costN = parseFloat(cost) || 0
  const shipN = parseFloat(ship) || 0
  const feePct = parseFloat(fees) || 0

  const platformFee = saleN * (feePct / 100)
  const profit      = saleN - costN - shipN - platformFee
  const margin      = saleN > 0 ? (profit / saleN) * 100 : 0
  const roi         = costN > 0 ? (profit / costN) * 100 : 0

  const getVerdict = (p) => {
    if (saleN === 0) return { text: 'Enter your numbers above', color: 'rgba(255,255,255,0.35)', glow: false }
    if (p < 0)    return { text: "You're losing money ❌ — Do not flip this",      color: '#ef4444', glow: false }
    if (p < 10)   return { text: "Not worth your time ⚠️ — Too low to bother",     color: '#ef4444', glow: false }
    if (p < 20)   return { text: "Slim margin 😐 — Only if you can move volume",   color: '#f97316', glow: false }
    if (p < 40)   return { text: "Decent flip 👍 — Worth doing",                   color: '#34d399', glow: false }
    if (p < 75)   return { text: "Good profit 🔥 — Go for it",                     color: '#34d399', glow: true  }
    return              { text: "Great flip 💰 — Stack as many as you can",        color: '#FFD700', glow: true  }
  }
  const verdict = getVerdict(profit)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <ToolInput label="What I paid ($)" value={cost} onChange={setCost} type="number" placeholder="15.00" />
        <ToolInput label="Platform fees (%)" value={fees} onChange={setFees} type="number" placeholder="13" />
        <ToolInput label="Shipping cost ($)" value={ship} onChange={setShip} type="number" placeholder="5.00" />
        <ToolInput label="Sale price ($)" value={sale} onChange={setSale} type="number" placeholder="45.00" />
      </div>
      <div className="rounded-xl p-4 space-y-2 transition-all duration-300"
        style={{
          background: verdict.glow ? 'rgba(255,215,0,0.04)' : 'rgba(255,255,255,0.03)',
          border: verdict.glow ? '1px solid rgba(255,215,0,0.25)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: verdict.glow ? '0 0 20px rgba(255,215,0,0.12)' : 'none',
        }}>
        <div className="flex justify-between">
          <span className="text-white/40 font-body text-sm">Net profit</span>
          <span className="font-body font-bold text-base" style={{ color: verdict.color }}>${profit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40 font-body text-sm">Margin</span>
          <span className="font-body text-sm text-white/70">{margin.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40 font-body text-sm">ROI</span>
          <span className="font-body text-sm text-white/70">{roi.toFixed(1)}%</span>
        </div>
        <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="font-body text-sm text-center font-semibold" style={{ color: verdict.color }}>{verdict.text}</p>
        </div>
      </div>
    </div>
  )
}

// Tool 2: Listing Title Generator
function TitleGenerator() {
  const [cat, setCat]     = useState('Electronics')
  const [brand, setBrand] = useState('')
  const [product, setProd]= useState('')
  const [cond, setCond]   = useState('Brand New')
  const [extra, setExtra] = useState('')
  const [titles, setTitles] = useState(null)

  const generate = () => {
    if (!brand || !product) return
    const condition = cond === 'Brand New' ? 'Brand New Sealed' : cond === 'Like New' ? 'Like New Excellent' : 'Good Used Condition'
    const extraStr = extra ? ` ${extra}` : ''
    setTitles([
      { platform: 'eBay', title: `${brand} ${product}${extraStr} ${condition} Free Shipping Fast` },
      { platform: 'Depop', title: `${brand} ${product}${extraStr} 🔥 ${cond} Ships Same Day` },
      { platform: 'Poshmark', title: `${brand} ${product} ${condition}${extraStr} Authentic` },
    ])
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-white/40 font-body text-xs mb-1">Category</label>
          <select value={cat} onChange={e => setCat(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-body text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {['Electronics','Clothing','Shoes','Fragrance','Watches','Jewelry','Hoodies'].map(c => <option key={c} value={c} style={{ background: '#111' }}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-white/40 font-body text-xs mb-1">Condition</label>
          <select value={cond} onChange={e => setCond(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-body text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {['Brand New','Like New','Good Used'].map(c => <option key={c} value={c} style={{ background: '#111' }}>{c}</option>)}
          </select>
        </div>
      </div>
      <ToolInput label="Brand" value={brand} onChange={setBrand} placeholder="Nike" />
      <ToolInput label="Product name" value={product} onChange={setProd} placeholder="Air Force 1 Low White" />
      <ToolInput label="Size / color / extra details (optional)" value={extra} onChange={setExtra} placeholder="Size 10 White" />
      <button onClick={generate} className="w-full py-3 rounded-xl font-body font-bold text-sm text-dark btn-gold min-h-[44px]">Generate Titles</button>
      {titles && (
        <div className="space-y-2 mt-1">
          {titles.map(({ platform, title }) => (
            <div key={platform} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/40 font-body text-xs font-semibold uppercase tracking-widest">{platform}</span>
                <CopyButton text={title} />
              </div>
              <p className="text-white/75 font-body text-sm leading-snug">{title}</p>
              <p className="text-white/25 font-body text-xs mt-1">{title.length} chars</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Tool 3: Platform Fee Calculator
const PLATFORMS = [
  { name: 'eBay',               fee: 0.1300 },
  { name: 'Depop',              fee: 0.1000 },
  { name: 'Poshmark',           fee: 0.2000 },
  { name: 'Mercari',            fee: 0.1000 },
  { name: 'Facebook Marketplace', fee: 0.0000 },
]

function PlatformFeeCalc() {
  const [price, setPrice] = useState('')
  const priceN = parseFloat(price) || 0

  const rows = PLATFORMS.map(p => ({ ...p, fee: p.fee * priceN, takeHome: priceN - p.fee * priceN }))
  const best = rows.reduce((a, b) => (a.takeHome > b.takeHome ? a : b), rows[0])

  return (
    <div className="space-y-3">
      <ToolInput label="Sale price ($)" value={price} onChange={setPrice} type="number" placeholder="50.00" />
      {priceN > 0 && (
        <div className="space-y-2">
          {rows.map(row => (
            <div key={row.name} className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: row.name === best.name ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${row.name === best.name ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.07)'}` }}>
              <div className="flex items-center gap-2">
                <span className="font-body text-sm text-white/70">{row.name}</span>
                {row.name === best.name && <span className="text-[10px] font-body px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700' }}>Best</span>}
              </div>
              <div className="text-right">
                <div className="font-body font-bold text-sm" style={{ color: '#34d399' }}>${row.takeHome.toFixed(2)}</div>
                <div className="text-white/30 font-body text-xs">-${row.fee.toFixed(2)} fee ({(row.fee / priceN * 100).toFixed(0)}%)</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Tool 4: Budget Planner
const BUDGET_RECS = [
  { max: 50,   cat: 'Fragrance',    units: 3,  avgProfit: 25, days: 7  },
  { max: 100,  cat: 'Fragrance',    units: 5,  avgProfit: 50, days: 10 },
  { max: 200,  cat: 'Electronics',  units: 3,  avgProfit: 90, days: 14 },
  { max: 400,  cat: 'Electronics',  units: 6,  avgProfit: 180,days: 18 },
  { max: 600,  cat: 'Shoes',        units: 4,  avgProfit: 200,days: 21 },
  { max: 1000, cat: 'Shoes',        units: 7,  avgProfit: 350,days: 28 },
]

function BudgetPlanner() {
  const [budget, setBudget] = useState(100)
  const rec = BUDGET_RECS.find(r => budget <= r.max) || BUDGET_RECS[BUDGET_RECS.length - 1]
  const pct = Math.min((rec.avgProfit / budget) * 100, 100)

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-white/40 font-body text-xs">Starting budget</span>
          <span className="font-body font-bold text-sm" style={{ color: '#FFD700' }}>${budget}</span>
        </div>
        <input type="range" min={20} max={1000} step={10} value={budget} onChange={e => setBudget(+e.target.value)}
          className="w-full accent-yellow-400" />
        <div className="flex justify-between text-white/20 font-body text-xs mt-1"><span>$20</span><span>$1,000</span></div>
      </div>
      <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}>
        <div className="grid grid-cols-2 gap-3">
          <div><div className="text-white/30 font-body text-xs mb-0.5">Best category</div><div className="font-body font-bold text-white text-sm">{rec.cat}</div></div>
          <div><div className="text-white/30 font-body text-xs mb-0.5">Units to buy</div><div className="font-body font-bold text-white text-sm">{rec.units} units</div></div>
          <div><div className="text-white/30 font-body text-xs mb-0.5">Est. profit</div><div className="font-body font-bold text-sm" style={{ color: '#34d399' }}>~${rec.avgProfit}</div></div>
          <div><div className="text-white/30 font-body text-xs mb-0.5">Est. sell time</div><div className="font-body font-bold text-white text-sm">{rec.days} days</div></div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-body text-white/30 mb-1.5"><span>Potential first month earnings</span><span>{pct.toFixed(0)}% ROI</span></div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#FFE566,#FFD700,#FFA500)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Tool 5: Price Research Guide
const RESEARCH_STEPS = [
  { text: 'Go to eBay and search your exact product name' },
  { text: 'Click "Sold Items" on the left sidebar filter' },
  { text: 'Sort by most recent to see current market prices' },
  { text: 'Note the price range of the last 10-15 sales' },
  { text: 'Ignore outliers (unusually high or low) — use the middle cluster' },
  { text: 'Search Depop for the same item — note selling prices' },
  { text: 'Check Facebook Marketplace for local demand and pricing' },
  { text: 'A good comp is recent (under 30 days), same condition, same platform' },
  { text: 'Set your price 5-8% below the average sold price to move faster' },
  { text: 'Revisit comps weekly — prices change with trends and season' },
]

function PriceResearchGuide() {
  const [checked, setChecked] = useState(new Set())
  const toggle = (i) => setChecked(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n })

  return (
    <div className="space-y-2">
      <p className="text-white/40 font-body text-xs mb-3">Follow these steps before pricing any item. Check them off as you go.</p>
      {RESEARCH_STEPS.map((step, i) => (
        <button key={i} onClick={() => toggle(i)}
          className="w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all"
          style={{ background: checked.has(i) ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${checked.has(i) ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.07)'}` }}>
          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-xs"
            style={{ background: checked.has(i) ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${checked.has(i) ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.1)'}`, color: '#34d399' }}>
            {checked.has(i) ? '✓' : ''}
          </div>
          <span className="font-body text-sm" style={{ color: checked.has(i) ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)', textDecoration: checked.has(i) ? 'line-through' : 'none' }}>
            {step.text}
          </span>
        </button>
      ))}
      {checked.size === RESEARCH_STEPS.length && (
        <div className="text-center py-3 rounded-xl font-body text-sm font-semibold" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
          ✅ Research complete — you're ready to price!
        </div>
      )}
    </div>
  )
}

// Tool 6: Listing Description Writer
function DescriptionWriter() {
  const [product, setProd]   = useState('')
  const [brand, setBrand]    = useState('')
  const [cond, setCond]      = useState('Brand New')
  const [features, setFeats] = useState('')
  const [flaws, setFlaws]    = useState('')
  const [platform, setPlat]  = useState('eBay')
  const [result, setResult]  = useState('')

  const generate = () => {
    if (!product) return
    const isEbay = platform === 'eBay'
    const condLine = cond === 'Brand New' ? 'This item is brand new and sealed.' : cond === 'Like New' ? 'This item is in like-new, excellent condition — barely used.' : `This item is in good used condition. ${flaws ? `Please note: ${flaws}.` : 'No major flaws.'}`
    const featureLine = features ? `Key features: ${features}.` : ''
    const flawLine = flaws && cond !== 'Good Used' ? `Please note: ${flaws}.` : ''

    if (isEbay) {
      setResult(`${brand ? brand + ' ' : ''}${product} — ${cond}\n\n${condLine} ${featureLine} ${flawLine}\n\nShips within 24 hours in secure packaging. Tracking provided on all orders. Returns accepted within 30 days if item not as described.\n\nMessage me with any questions — I respond fast!`)
    } else {
      setResult(`${brand ? brand + ' ' : ''}${product} dropping! 🔥\n\n${condLine} ${featureLine} ${flawLine}\n\nShips next day 📦 DM me with any ?s, happy to help!\n\n#${product.replace(/\s/g,'')} #${brand?.replace(/\s/g,'') || 'resell'} #forsale #${platform.toLowerCase()}`)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-white/40 font-body text-xs mb-1">Platform</label>
          <select value={platform} onChange={e => setPlat(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-body text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {['eBay','Depop','Poshmark','Mercari'].map(p => <option key={p} value={p} style={{ background: '#111' }}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-white/40 font-body text-xs mb-1">Condition</label>
          <select value={cond} onChange={e => setCond(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-body text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {['Brand New','Like New','Good Used'].map(c => <option key={c} value={c} style={{ background: '#111' }}>{c}</option>)}
          </select>
        </div>
      </div>
      <ToolInput label="Brand (optional)" value={brand} onChange={setBrand} placeholder="Nike" />
      <ToolInput label="Product name" value={product} onChange={setProd} placeholder="Air Force 1 Low White" />
      <ToolInput label="Key features (optional)" value={features} onChange={setFeats} placeholder="Original box, all tags, deadstock" />
      <ToolInput label="Any flaws to mention (optional)" value={flaws} onChange={setFlaws} placeholder="Small scuff on right heel" />
      <button onClick={generate} className="w-full py-3 rounded-xl font-body font-bold text-sm text-dark btn-gold min-h-[44px]">Generate Description</button>
      {result && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/30 font-body text-xs">Ready to paste</span>
            <CopyButton text={result} />
          </div>
          <p className="text-white/70 font-body text-sm whitespace-pre-wrap leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  )
}

// Tool 7: Monthly Income Goal Tracker
function GoalTracker() {
  const [goal, setGoal]     = useState(() => { try { return JSON.parse(localStorage.getItem('fl_goal_amount') || '500') } catch { return 500 } })
  const [sales, setSales]   = useState(() => { try { return JSON.parse(localStorage.getItem('fl_goal_sales') || '[]') } catch { return [] } })
  const [amount, setAmount] = useState('')

  const saveGoal = (v) => { setGoal(v); localStorage.setItem('fl_goal_amount', v) }
  const addSale  = () => {
    const n = parseFloat(amount)
    if (!n || n <= 0) return
    const next = [...sales, { amount: n, date: new Date().toLocaleDateString() }]
    setSales(next); localStorage.setItem('fl_goal_sales', JSON.stringify(next)); setAmount('')
  }
  const clearSales = () => { setSales([]); localStorage.setItem('fl_goal_sales', '[]') }

  const total = sales.reduce((a, s) => a + s.amount, 0)
  const pct   = Math.min((total / goal) * 100, 100)
  const remaining = Math.max(goal - total, 0)

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-white/40 font-body text-xs">Monthly goal</span>
          <span className="font-body font-bold text-sm" style={{ color: '#FFD700' }}>${goal}</span>
        </div>
        <input type="range" min={100} max={5000} step={50} value={goal} onChange={e => saveGoal(+e.target.value)} className="w-full accent-yellow-400" />
      </div>

      <div className="rounded-xl p-4" style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}>
        <div className="flex justify-between mb-2">
          <span className="text-white/40 font-body text-xs">Progress</span>
          <span className="font-body font-bold text-sm" style={{ color: total >= goal ? '#34d399' : '#FFD700' }}>${total.toFixed(2)} / ${goal}</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} className="h-full rounded-full"
            style={{ background: total >= goal ? 'linear-gradient(to right,#34d399,#059669)' : 'linear-gradient(to right,#FFE566,#FFD700,#FFA500)' }} />
        </div>
        {remaining > 0 ? (
          <p className="text-white/40 font-body text-xs text-center">You need <span className="text-white/70 font-semibold">${remaining.toFixed(2)}</span> more this month to hit your goal</p>
        ) : (
          <p className="text-center font-body text-sm font-bold" style={{ color: '#34d399' }}>🎉 Goal reached!</p>
        )}
      </div>

      <div className="flex gap-2">
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Log a sale ($)"
          className="flex-1 px-3 py-2.5 rounded-xl text-sm font-body text-white placeholder-white/20 outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
        <button onClick={addSale} className="px-4 py-2.5 rounded-xl text-sm font-body font-bold text-dark btn-gold min-h-[44px]">Add</button>
      </div>

      {sales.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/30 font-body text-xs">Recent sales ({sales.length})</span>
            <button onClick={clearSales} className="text-white/20 hover:text-white/50 font-body text-xs">Clear</button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {[...sales].reverse().slice(0, 8).map((s, i) => (
              <div key={i} className="flex justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-white/40 font-body text-xs">{s.date}</span>
                <span className="font-body text-sm font-semibold" style={{ color: '#34d399' }}>+${s.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Tool 8: Profit Journal
function ProfitJournal() {
  const [entries, setEntries] = useState(() => { try { return JSON.parse(localStorage.getItem('fl_journal') || '[]') } catch { return [] } })
  const [form, setForm] = useState({ item: '', platform: 'eBay', bought: '', sold: '' })

  const save = (next) => { setEntries(next); localStorage.setItem('fl_journal', JSON.stringify(next)) }

  const addEntry = () => {
    const b = parseFloat(form.bought), s = parseFloat(form.sold)
    if (!form.item || !b || !s) return
    const entry = { id: Date.now(), date: new Date().toLocaleDateString(), item: form.item, platform: form.platform, bought: b, sold: s, profit: s - b }
    save([entry, ...entries])
    setForm({ item: '', platform: 'eBay', bought: '', sold: '' })
  }

  const totalProfit = entries.reduce((a, e) => a + e.profit, 0)
  const totalItems  = entries.length

  const exportCSV = () => {
    const header = 'Date,Item,Platform,Bought,Sold,Profit\n'
    const rows   = entries.map(e => `${e.date},${e.item},${e.platform},${e.bought},${e.sold},${e.profit.toFixed(2)}`).join('\n')
    const blob   = new Blob([header + rows], { type: 'text/csv' })
    const a      = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'flip-labs-journal.csv'; a.click()
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
          <div className="font-display text-2xl" style={{ color: '#34d399' }}>${totalProfit.toFixed(2)}</div>
          <div className="text-white/30 font-body text-xs">Total Earned</div>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)' }}>
          <div className="font-display text-2xl" style={{ color: '#FFD700' }}>{totalItems}</div>
          <div className="text-white/30 font-body text-xs">Items Sold</div>
        </div>
      </div>

      {/* Add entry */}
      <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <ToolInput label="Item name" value={form.item} onChange={v => setForm(p => ({ ...p, item: v }))} placeholder="iPhone 13 Pro Case" />
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-white/40 font-body text-xs mb-1">Platform</label>
            <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}
              className="w-full px-2 py-2 rounded-xl text-xs font-body text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {['eBay','Depop','Poshmark','Mercari','FB'].map(p => <option key={p} value={p} style={{ background: '#111' }}>{p}</option>)}
            </select>
          </div>
          <ToolInput label="Bought ($)" value={form.bought} onChange={v => setForm(p => ({ ...p, bought: v }))} type="number" placeholder="10" />
          <ToolInput label="Sold ($)" value={form.sold} onChange={v => setForm(p => ({ ...p, sold: v }))} type="number" placeholder="35" />
        </div>
        <button onClick={addEntry} className="w-full py-2.5 rounded-xl font-body font-bold text-sm text-dark btn-gold min-h-[40px]">Log Sale +</button>
      </div>

      {/* Entries */}
      {entries.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/30 font-body text-xs uppercase tracking-widest">History</span>
            <button onClick={exportCSV} className="text-xs font-body font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(255,215,0,0.08)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)' }}>Export CSV</button>
          </div>
          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {entries.slice(0, 20).map(e => (
              <div key={e.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)' }}>
                <div className="flex-1 min-w-0">
                  <div className="text-white/70 font-body text-sm truncate">{e.item}</div>
                  <div className="text-white/25 font-body text-xs">{e.platform} · {e.date}</div>
                </div>
                <span className="font-body font-bold text-sm flex-shrink-0" style={{ color: e.profit >= 0 ? '#34d399' : '#ef4444' }}>
                  {e.profit >= 0 ? '+' : ''}${e.profit.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Tool 9: Seller Checklist
function SellerChecklist() {
  const [checked, setChecked] = useState(new Set())
  const toggle = (i) => setChecked(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })
  const reset  = () => setChecked(new Set())
  const pct    = (checked.size / LISTING_CHECKLIST.length) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex justify-between text-xs font-body text-white/30 mb-1">
            <span>Checklist progress</span><span>{checked.size}/{LISTING_CHECKLIST.length}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.3 }}
              className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#FFE566,#FFD700,#FFA500)' }} />
          </div>
        </div>
        <button onClick={reset} className="text-xs font-body px-3 py-1.5 rounded-lg flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
          Reset
        </button>
      </div>
      {LISTING_CHECKLIST.map((item, i) => (
        <button key={i} onClick={() => toggle(i)}
          className="w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all min-h-[44px]"
          style={{ background: checked.has(i) ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${checked.has(i) ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.07)'}` }}>
          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-xs"
            style={{ background: checked.has(i) ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${checked.has(i) ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.1)'}`, color: '#34d399' }}>
            {checked.has(i) ? '✓' : ''}
          </div>
          <span className="font-body text-sm" style={{ color: checked.has(i) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.65)', textDecoration: checked.has(i) ? 'line-through' : 'none' }}>
            {item}
          </span>
        </button>
      ))}
      {checked.size === LISTING_CHECKLIST.length && (
        <div className="text-center py-3 rounded-xl font-body text-sm font-semibold" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
          Your listing is ready to go 🔥
        </div>
      )}
    </div>
  )
}

// Tool 10: Price Drop Reminder
function PriceDropReminder() {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('fl_pdr') || '[]') } catch { return [] } })
  const [form, setForm]   = useState({ name: '', price: '', platform: 'eBay', date: new Date().toISOString().split('T')[0] })

  const save      = (next) => { setItems(next); localStorage.setItem('fl_pdr', JSON.stringify(next)) }
  const addItem   = () => {
    if (!form.name || !form.price) return
    save([...items, { id: Date.now(), ...form, price: parseFloat(form.price) }])
    setForm({ name: '', price: '', platform: 'eBay', date: new Date().toISOString().split('T')[0] })
  }
  const removeItem = (id) => save(items.filter(i => i.id !== id))
  const isStale    = (d) => Math.floor((Date.now() - new Date(d).getTime()) / 86400000) >= 21
  const daysListed = (d) => Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  const dropPrice  = (p) => (p * 0.9).toFixed(2)

  return (
    <div className="space-y-4">
      <p className="text-white/40 font-body text-xs">Items listed 21+ days automatically get flagged. Drop the price to move inventory.</p>
      <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <ToolInput label="Item name" value={form.name} onChange={v => setForm(p => ({...p, name: v}))} placeholder="Nike Air Force 1 Low" />
        <div className="grid grid-cols-2 gap-2">
          <ToolInput label="Listed price ($)" value={form.price} onChange={v => setForm(p => ({...p, price: v}))} type="number" placeholder="65.00" />
          <div>
            <label className="block text-white/40 font-body text-xs mb-1">Platform</label>
            <select value={form.platform} onChange={e => setForm(p => ({...p, platform: e.target.value}))}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-body text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {['eBay','Depop','Poshmark','Mercari','FB'].map(pl => <option key={pl} value={pl} style={{ background: '#111' }}>{pl}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-white/40 font-body text-xs mb-1">Date Listed</label>
          <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-body text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' }} />
        </div>
        <button onClick={addItem} className="w-full py-2.5 rounded-xl font-body font-bold text-sm text-dark btn-gold min-h-[40px]">Track This Item +</button>
      </div>
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map(item => {
            const stale = isStale(item.date)
            const days  = daysListed(item.date)
            return (
              <div key={item.id} className="rounded-xl p-3"
                style={{ background: stale ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${stale ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.07)'}` }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <div className="text-white/80 font-body text-sm font-semibold">{item.name}</div>
                    <div className="text-white/30 font-body text-xs">{item.platform} · {days} day{days !== 1 ? 's' : ''} listed · ${item.price}</div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-white/20 hover:text-white/50 text-xs px-2 py-1 rounded min-h-[28px]">✕</button>
                </div>
                {stale && (
                  <div className="flex items-center justify-between gap-2 mt-2 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <span className="text-xs font-body font-bold" style={{ color: '#ef4444' }}>🔴 Drop the price</span>
                    <span className="text-xs font-body font-semibold" style={{ color: '#ef4444' }}>Try ${dropPrice(item.price)}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ToolsSection({ userTier }) {
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl sm:text-3xl text-white mb-1">Your <span className="gold-text">Tools</span></h2>
        <p className="text-white/40 font-body text-sm">Built-in tools to help you calculate, plan, and grow. Tap any tool to expand it.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="space-y-3">
        <ToolCard title="Profit Calculator" icon="🧮" description="Know your exact profit before you buy anything" tier="free" userTier={userTier}>
          <ProfitCalculator />
        </ToolCard>

        <ToolCard title="Listing Title Generator" icon="✍️" description="3 optimized titles for eBay, Depop, and Poshmark" tier="beginner" userTier={userTier}>
          <TitleGenerator />
        </ToolCard>

        <ToolCard title="Platform Fee Calculator" icon="💸" description="See your take-home across all 5 platforms side by side" tier="beginner" userTier={userTier}>
          <PlatformFeeCalc />
        </ToolCard>

        <ToolCard title="Starting Budget Planner" icon="🎯" description="Enter your budget — get a custom action plan" tier="beginner" userTier={userTier}>
          <BudgetPlanner />
        </ToolCard>

        <ToolCard title="Price Research Guide" icon="🔍" description="Step-by-step walkthrough to find the right price" tier="intermediate" userTier={userTier}>
          <PriceResearchGuide />
        </ToolCard>

        <ToolCard title="Listing Description Writer" icon="📝" description="Generate a complete, ready-to-paste listing description" tier="intermediate" userTier={userTier}>
          <DescriptionWriter />
        </ToolCard>

        <ToolCard title="Monthly Income Goal Tracker" icon="📈" description="Set a goal, track your progress, reverse-engineer your plan" tier="pro" userTier={userTier}>
          <GoalTracker />
        </ToolCard>

        <ToolCard title="Resell Profit Journal" icon="📒" description="Log every sale, track totals, export to CSV" tier="pro" userTier={userTier}>
          <ProfitJournal />
        </ToolCard>

        <ToolCard title="Pre-Listing Seller Checklist" icon="✅" description="11-point checklist — make sure every listing is optimized before posting" tier="free" userTier={userTier}>
          <SellerChecklist />
        </ToolCard>

        <ToolCard title="Price Drop Reminder" icon="🔴" description="Track listed items — flags anything listed 21+ days and suggests a 10% price drop" tier="free" userTier={userTier}>
          <PriceDropReminder />
        </ToolCard>
      </motion.div>
    </div>
  )
}

// ─── Milestones section ───────────────────────────────────────────────────────

function MilestonesSection({ userTier, completedMilestones, onToggleMilestone, burst }) {
  const visibleMilestones = userTier === 'free' ? MILESTONES.slice(0, 2) : MILESTONES
  const done = completedMilestones.size
  const total = visibleMilestones.length

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl sm:text-3xl text-white mb-1">Your <span className="gold-text">Journey</span></h2>
        <p className="text-white/40 font-body text-sm">Tap "Mark Reached" when you hit each milestone. Your path is laid out — follow it.</p>
      </motion.div>

      {/* Progress bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/40 font-body text-xs">Overall Progress</span>
          <span className="font-body font-bold text-xs" style={{ color: '#FFD700' }}>{done}/{total} Milestones</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${(done / total) * 100}%` }} transition={{ duration: 0.7, ease: 'easeOut' }}
            className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#FFE566,#FFD700,#FFA500)', boxShadow: '0 0 10px rgba(255,215,0,0.5)' }} />
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical gold line */}
        <div className="absolute left-[22px] top-8 bottom-8 w-px"
          style={{ background: 'linear-gradient(to bottom,rgba(255,215,0,0.5),rgba(255,215,0,0.1))' }} />

        <div className="space-y-4">
          {visibleMilestones.map((m, i) => {
            const isReached  = completedMilestones.has(m.id)
            const isBurst    = burst === m.id
            const isLocked   = !canAccess(m.tier, userTier) && !isReached

            return (
              <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="relative flex items-start gap-4">
                {/* Circle node */}
                <div className={`relative flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-lg z-10 transition-all ${isBurst ? 'milestone-burst' : ''}`}
                  style={{
                    background: isReached ? 'linear-gradient(135deg,#FFE566,#FFD700,#FFA500)' : isLocked ? 'rgba(255,255,255,0.05)' : 'rgba(255,215,0,0.08)',
                    border: isReached ? 'none' : isLocked ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,215,0,0.3)',
                    boxShadow: isReached ? '0 0 20px rgba(255,215,0,0.5)' : 'none',
                    opacity: isLocked ? 0.4 : 1,
                  }}>
                  {isLocked ? '🔒' : m.icon}
                </div>

                {/* Content card */}
                <div className="flex-1 rounded-2xl p-4 min-w-0"
                  style={{
                    background: isReached ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.02)',
                    border: isReached ? '1px solid rgba(255,215,0,0.25)' : '1px solid rgba(255,255,255,0.06)',
                    opacity: isLocked ? 0.5 : 1,
                  }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-base text-white">{m.title}</span>
                        <span className="text-xs font-body px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)' }}>{m.amount}</span>
                      </div>
                      <p className="text-white/50 font-body text-xs mt-1 leading-relaxed">{m.desc}</p>
                    </div>
                    {!isLocked && (
                      <button onClick={() => onToggleMilestone(m.id)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-bold min-h-[36px] flex items-center whitespace-nowrap transition-all active:scale-[0.96]"
                        style={isReached ? { background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.35)', color: '#34d399' } : { background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700' }}>
                        {isReached ? '✓ Reached' : 'Mark Reached'}
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="text-white/20 font-body text-xs flex-shrink-0 mt-0.5">→</span>
                      <p className="text-white/35 font-body text-xs leading-relaxed"><span className="text-white/50 font-semibold">Action:</span> {m.action}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-500/50 font-body text-xs flex-shrink-0 mt-0.5">🔓</span>
                      <p className="text-white/35 font-body text-xs leading-relaxed"><span className="text-white/50 font-semibold">Unlocks:</span> {m.unlock}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {userTier === 'free' && (
          <div className="rounded-2xl p-4 text-center mt-2" style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}>
            <p className="text-white/50 font-body text-xs mb-3">6 more milestones unlocked on Beginner+</p>
            <a href="/#plans" className="btn-gold px-5 py-2.5 rounded-full text-dark font-body font-bold text-xs inline-block active:scale-[0.97] transition-transform">
              Upgrade to Unlock →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Seven Day Plan ───────────────────────────────────────────────────────────

function SevenDayPlan() {
  const [checked, setChecked] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('fl_7day') || '[]')) } catch { return new Set() }
  })
  const [celebrating, setCelebrating] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fl_7day') || '[]').length === 7 } catch { return false }
  })

  const toggle = (i) => {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      localStorage.setItem('fl_7day', JSON.stringify([...next]))
      if (next.size === 7) setCelebrating(true)
      return next
    })
  }

  const pct = (checked.size / 7) * 100

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
      className="rounded-2xl p-4 space-y-3"
      style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-white">Your First <span className="gold-text">7 Days</span></h3>
        <span className="text-xs font-body text-white/40">{checked.size}/7 done</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#FFE566,#FFD700,#FFA500)' }} />
      </div>
      {celebrating && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl p-3 text-center milestone-burst"
          style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.35)' }}>
          <p className="font-body font-bold text-sm" style={{ color: '#FFD700' }}>You crushed your first week 🔥</p>
        </motion.div>
      )}
      <div className="space-y-2">
        {SEVEN_DAYS.map((task, i) => (
          <button key={i} onClick={() => toggle(i)}
            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all min-h-[48px]"
            style={{ background: checked.has(i) ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${checked.has(i) ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs transition-all"
              style={{ background: checked.has(i) ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.05)', border: `1px solid ${checked.has(i) ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.12)'}`, color: '#34d399' }}>
              {checked.has(i) ? '✓' : <span className="text-white/30 font-body text-[9px]">{i+1}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-white/25 font-body text-[10px] uppercase tracking-widest">Day {i+1}</span>
              <p className="font-body text-sm leading-snug mt-0.5"
                style={{ color: checked.has(i) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)', textDecoration: checked.has(i) ? 'line-through' : 'none' }}>
                {task}
              </p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Motivation Wall ──────────────────────────────────────────────────────────

function MotivationWall() {
  const [feed, setFeed] = useState(() =>
    WINS_FEED_DATA.slice(0, 6).map((w, i) => ({ ...w, id: i, ago: i === 0 ? 'just now' : `${(i + 1) * 4}m ago` }))
  )

  useEffect(() => {
    const next = () => {
      const w = WINS_FEED_DATA[Math.floor(Math.random() * WINS_FEED_DATA.length)]
      setFeed(prev => [{ ...w, id: Date.now(), ago: 'just now' }, ...prev.slice(0, 9)])
    }
    const id = setInterval(next, 45000 + Math.random() * 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,215,0,0.1)' }}>
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <h3 className="font-display text-base text-white">Recent Wins <span style={{ color: '#FFD700' }}>🔥</span></h3>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-white/30 font-body text-xs">Live</span>
        </div>
      </div>
      <div className="max-h-52 overflow-y-auto">
        <AnimatePresence initial={false}>
          {feed.map(w => (
            <motion.div key={w.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 px-4 py-2.5 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-dark font-display text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#FFE566,#FFD700,#FFA500)' }}>
                {w.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white/70 font-body text-xs font-semibold leading-tight truncate">
                  {w.name} <span className="text-white/30 font-normal">from {w.location}</span>
                </div>
                <div className="text-white/35 font-body text-xs">
                  joined <span style={{ color: '#FFD700' }} className="font-semibold">{w.plan}</span>
                </div>
              </div>
              <span className="text-white/20 font-body text-[10px] flex-shrink-0">{w.ago}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Home section ─────────────────────────────────────────────────────────────

const today = new Date().getDate() - 1
const todayTip = DAILY_TIPS[today % DAILY_TIPS.length]

function HomeSection({ member, setTab, completed, completedMilestones }) {
  const totalLessons = COURSE_MODULES.reduce((acc, m) => acc + m.lessons.length, 0)
  const [tipDismissed, setTipDismissed] = useState(() => localStorage.getItem('fl_tip_dismissed') === String(new Date().getDate()))
  const dismissTip = () => { localStorage.setItem('fl_tip_dismissed', String(new Date().getDate())); setTipDismissed(true) }

  // Find next incomplete accessible lesson
  const nextLesson = (() => {
    for (const mod of COURSE_MODULES) {
      if (!canAccess(mod.tier, member.tier)) continue
      for (const lesson of mod.lessons) {
        if (!completed.has(lesson.id)) return { lesson, mod }
      }
    }
    return null
  })()

  const QUICK_ACTIONS = [
    { label: 'Open Vendors', icon: '🏪', tab: 'vendors' },
    { label: 'Continue Learning', icon: '📚', tab: 'learn' },
    { label: 'Use a Tool', icon: '🛠️', tab: 'tools' },
    { label: 'View Progress', icon: '🏆', tab: 'milestones' },
  ]

  return (
    <div className="space-y-4">
      {/* Welcome card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-white/50 font-body text-sm mb-0.5">Welcome back 👋</p>
            <h2 className="font-display text-2xl sm:text-3xl text-white">
              <span className="gold-text">Flip Labs</span> Dashboard
            </h2>
          </div>
          <PlanBadge tier={member.tier} planDisplay={member.planDisplay} />
        </div>
        {/* Lesson progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-body text-white/30 mb-1.5">
            <span>{completed.size} of {totalLessons} lessons completed</span>
            <span>{totalLessons > 0 ? Math.round((completed.size / totalLessons) * 100) : 0}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${(completed.size / totalLessons) * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#FFE566,#FFD700,#FFA500)' }} />
          </div>
        </div>
      </motion.div>

      {/* Daily tip */}
      <AnimatePresence>
        {!tipDismissed && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220, delay: 0.15 }}
            className="rounded-2xl p-4 flex items-start gap-3"
            style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)' }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(255,215,0,0.1)' }}>💡</div>
            <div className="flex-1 min-w-0">
              <div className="text-white/35 font-body text-[10px] uppercase tracking-widest mb-1">Daily Tip</div>
              <p className="text-white/70 font-body text-sm leading-relaxed">{todayTip}</p>
            </div>
            <button onClick={dismissTip} className="flex-shrink-0 text-white/25 hover:text-white/50 text-xs px-2 py-1 rounded-lg min-h-[36px] flex items-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}>Got it</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7-day plan */}
      <SevenDayPlan />

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="text-white/25 font-body text-xs uppercase tracking-widest mb-3">Quick Access</p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((a, i) => (
            <button key={i} onClick={() => setTab(a.tab)}
              className="flex items-center gap-3 p-3.5 rounded-2xl text-left active:scale-[0.97] transition-transform min-h-[60px]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,215,0,0.1)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)' }}>{a.icon}</div>
              <span className="font-body font-semibold text-white/70 text-sm">{a.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Motivation wall */}
      <MotivationWall />

      {/* What to focus on next */}
      {nextLesson && (
        <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          onClick={() => setTab('learn')}
          className="w-full rounded-2xl p-4 text-left flex items-center gap-4 min-h-[68px] active:scale-[0.98] transition-transform"
          style={{ background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.18)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}>📖</div>
          <div className="flex-1 min-w-0">
            <div className="text-white/40 font-body text-xs mb-0.5">Up next</div>
            <div className="font-body font-semibold text-white text-sm truncate">{nextLesson.lesson.title}</div>
            <div className="text-white/30 font-body text-xs">{nextLesson.mod.title} · {nextLesson.lesson.readTime}</div>
          </div>
          <span className="text-white/25 flex-shrink-0">›</span>
        </motion.button>
      )}

      {/* Upgrade banner */}
      {member.tier !== 'pro' && member.tier !== 'admin' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl p-4 flex items-center justify-between gap-3"
          style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)' }}>
          <div className="min-w-0">
            <p className="font-body font-semibold text-white/80 text-sm">
              🔓 Unlock more {member.tier === 'beginner' ? 'vendors, tools &' : 'tools &'} lessons
            </p>
            <p className="text-white/35 font-body text-xs mt-0.5">
              Upgrade to {member.tier === 'beginner' ? 'Intermediate' : 'Pro'} for full access
            </p>
          </div>
          <a href="/#plans" className="btn-gold px-4 py-2.5 rounded-full text-dark font-body font-bold text-xs flex-shrink-0 min-h-[40px] flex items-center active:scale-[0.97] transition-transform">
            Upgrade →
          </a>
        </motion.div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Vendors', value: member.content.categories.length, icon: '🏪', tab: 'vendors' },
          { label: 'Lessons Done', value: completed.size, icon: '✅', tab: 'learn' },
          { label: 'Milestones', value: `${completedMilestones.size}/${MILESTONES.length}`, icon: '🏆', tab: 'milestones' },
        ].map((s, i) => (
          <motion.button key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
            onClick={() => setTab(s.tab)}
            className="rounded-xl p-3 text-center min-h-[72px] flex flex-col items-center justify-center gap-1 active:scale-[0.97] transition-transform"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,215,0,0.1)' }}>
            <div className="text-lg">{s.icon}</div>
            <div className="font-display text-xl gold-text">{s.value}</div>
            <div className="text-white/30 font-body text-[10px]">{s.label}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ─── Resell Glossary ──────────────────────────────────────────────────────────

function ResellGlossary() {
  const [search, setSearch] = useState('')
  const filtered = search
    ? GLOSSARY.filter(g => g.term.toLowerCase().includes(search.toLowerCase()) || g.def.toLowerCase().includes(search.toLowerCase()))
    : GLOSSARY

  return (
    <div className="space-y-3 mt-6">
      <div className="border-t pt-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h2 className="font-display text-xl text-white mb-0.5">Resell <span className="gold-text">Glossary</span></h2>
        <p className="text-white/40 font-body text-sm mb-3">Every term you need to know.</p>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search terms…"
          className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder-white/20 outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }} />
      </div>
      <div className="space-y-1.5">
        {filtered.map(g => (
          <div key={g.term} className="flex gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="font-body font-bold text-sm flex-shrink-0" style={{ color: '#FFD700', minWidth: 100 }}>{g.term}</span>
            <span className="text-white/55 font-body text-sm leading-snug">{g.def}</span>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-white/30 font-body text-sm text-center py-4">No terms match "{search}"</p>}
      </div>
    </div>
  )
}

// ─── Platform Comparison ──────────────────────────────────────────────────────

function PlatformComparison() {
  return (
    <div className="space-y-3 mt-6">
      <div className="border-t pt-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h2 className="font-display text-xl text-white mb-0.5">Platform <span className="gold-text">Comparison</span></h2>
        <p className="text-white/40 font-body text-sm mb-3">Know where to sell before you list. Scroll to see all →</p>
      </div>
      <div className="flex gap-3 pb-3 -mx-1 px-1" style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        {PLATFORMS_DATA.map(p => (
          <div key={p.name} className="rounded-2xl p-4 flex-shrink-0"
            style={{ width: 210, scrollSnapAlign: 'start', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,215,0,0.12)' }}>
            <div className="font-display text-lg gold-text mb-3">{p.name}</div>
            {[
              { l: 'Best for',   v: p.bestFor },
              { l: 'Seller fee', v: p.fee },
              { l: 'Shipping',   v: p.shipping },
              { l: 'Payout',     v: p.payout },
              { l: 'Difficulty', v: p.difficulty },
              { l: 'Buyer age',  v: p.buyers },
            ].map(r => (
              <div key={r.l} className="mb-2">
                <div className="text-white/25 font-body text-[9px] uppercase tracking-widest">{r.l}</div>
                <div className="text-white/70 font-body text-xs font-medium leading-snug">{r.v}</div>
              </div>
            ))}
            <div className="mt-2 pt-2 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[11px] font-body font-medium" style={{ color: '#34d399' }}>✓ {p.pro}</p>
              <p className="text-[11px] font-body font-medium" style={{ color: '#ef4444' }}>✕ {p.con}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Account section ──────────────────────────────────────────────────────────

function AccountSection({ member, onManageBilling, onSignOut }) {
  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl sm:text-3xl text-white mb-1">Your <span className="gold-text">Account</span></h2>
        <p className="text-white/40 font-body text-sm">Manage your plan and access.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,215,0,0.12)' }}>
        {[
          { label: 'Current Plan', content: <PlanBadge tier={member.tier} planDisplay={member.planDisplay} /> },
          member.email ? { label: 'Email', content: <span className="text-white/60 font-body text-sm truncate max-w-[180px] block">{member.email}</span> } : null,
          { label: 'Billing', content: <button onClick={onManageBilling} className="text-sm font-body font-semibold min-h-[44px]" style={{ color: '#FFD700' }}>Manage Billing ↗</button> },
          (member.tier !== 'pro' && member.tier !== 'admin') ? { label: 'Upgrade', content: <a href="/#plans" className="text-sm font-body font-semibold min-h-[44px] flex items-center" style={{ color: '#FFD700' }}>View Plans ↗</a> } : null,
          { label: 'Support', content: <a href="mailto:support@fliplabs.com" className="text-sm font-body text-white/50 hover:text-white/80 min-h-[44px] flex items-center">support@fliplabs.com ↗</a> },
        ].filter(Boolean).map((row, i, arr) => (
          <div key={i} className="flex items-center justify-between px-5 py-3 min-h-[56px]"
            style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <span className="text-white/40 font-body text-sm">{row.label}</span>
            {row.content}
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white/30 font-body text-xs leading-relaxed">
          To cancel your subscription, use "Manage Billing" above or email <span className="text-white/50">support@fliplabs.com</span>
        </p>
      </motion.div>

      {/* Upgrade comparison card — hidden for pro and admin */}
      {member.tier !== 'pro' && member.tier !== 'admin' && (() => {
        const nextTier = TIER_NEXT[member.tier]
        const features = UPGRADE_FEATURES[nextTier] || []
        const price    = PLAN_PRICES[nextTier] || ''
        const name     = nextTier ? nextTier.charAt(0).toUpperCase() + nextTier.slice(1) : ''
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.2)' }}>
            <div>
              <div className="text-white/35 font-body text-[10px] uppercase tracking-widest mb-1">Next step</div>
              <h3 className="font-display text-xl text-white">{name} Plan <span className="text-white/30 font-body text-sm font-normal">— {price}</span></h3>
            </div>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] mt-0.5"
                    style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}>✓</span>
                  <span className="text-white/60 font-body text-sm leading-snug">{f}</span>
                </li>
              ))}
            </ul>
            <a href="/#plans"
              className="btn-gold w-full py-3 rounded-full text-dark font-body font-bold text-sm flex items-center justify-center min-h-[48px] active:scale-[0.97] transition-transform">
              Upgrade to {name} →
            </a>
          </motion.div>
        )
      })()}

      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        onClick={onSignOut}
        className="w-full py-3.5 rounded-xl font-body text-sm text-white/40 hover:text-white/70 transition-colors min-h-[48px]"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        Sign Out / Clear Access
      </motion.button>
    </div>
  )
}

// ─── Onboarding Modal ─────────────────────────────────────────────────────────

const ONBOARDING_STEPS = [
  {
    emoji: '👋',
    title: 'Welcome to the platform',
    body: "Here's how to get started in 60 seconds. We'll walk you through the 3 most important things to do first.",
    hint: '📚 Start in the Learn tab — your first lessons are free',
  },
  {
    emoji: '🏪',
    title: 'Your vendors are waiting',
    body: 'Check the Vendors tab for your free jewelry vendors — no payment needed. More categories unlock when you upgrade.',
    hint: '🏪 Vendors tab is live right now, no upgrade needed',
  },
  {
    emoji: '🎯',
    title: 'Your first goal',
    body: 'Complete Day 1 of your 7-day quick start plan. It takes 10 minutes and sets you up for your first sale.',
    hint: '🏠 Find the plan on the Home tab',
  },
]

function OnboardingModal({ onClose, setTab }) {
  const [step, setStep] = useState(0)
  const current = ONBOARDING_STEPS[step]
  const isLast  = step === ONBOARDING_STEPS.length - 1

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
        className="w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-6 space-y-5"
        style={{ background: '#0f0f0f', border: '1px solid rgba(255,215,0,0.2)' }}>
        {/* Progress dots + skip */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {ONBOARDING_STEPS.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{ width: i === step ? 20 : 6, height: 6, background: i === step ? '#FFD700' : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>
          <button onClick={onClose}
            className="text-white/30 hover:text-white/60 text-xs font-body px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            Skip
          </button>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
            className="space-y-3">
            <div className="text-4xl">{current.emoji}</div>
            <h2 className="font-display text-2xl text-white">{current.title}</h2>
            <p className="text-white/55 font-body text-sm leading-relaxed">{current.body}</p>
            <div className="px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.18)' }}>
              <p className="font-body text-xs font-semibold" style={{ color: '#FFD700' }}>{current.hint}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        {isLast ? (
          <button onClick={() => { setTab('home'); onClose() }}
            className="w-full py-4 rounded-full font-body font-bold text-sm text-dark btn-gold min-h-[52px]">
            Let's go 🔥
          </button>
        ) : (
          <button onClick={() => setStep(s => s + 1)}
            className="w-full py-4 rounded-full font-body font-bold text-sm text-dark btn-gold min-h-[52px]">
            Next →
          </button>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── Admin section ────────────────────────────────────────────────────────────

const TIER_OPTIONS = ['free', 'beginner', 'intermediate', 'pro']

function AdminSection() {
  const [users, setUsers]         = useState(() => {
    const raw = getUsers()
    return Object.values(raw)
  })
  const [search, setSearch]       = useState('')
  const [saved, setSaved]         = useState({})
  const [pendingTiers, setPending] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(null)

  const refreshUsers = () => setUsers(Object.values(getUsers()))

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleTierChange = (email, tier) => {
    setPending(p => ({ ...p, [email]: tier }))
  }

  const handleSave = (email) => {
    const tier = pendingTiers[email]
    if (!tier) return
    updateUserTier(email, tier)
    refreshUsers()
    setSaved(p => ({ ...p, [email]: true }))
    setTimeout(() => setSaved(p => { const n = { ...p }; delete n[email]; return n }), 1500)
  }

  const handleDelete = (email) => {
    const raw = getUsers()
    delete raw[email]
    localStorage.setItem('fl_users', JSON.stringify(raw))
    refreshUsers()
    setConfirmDelete(null)
  }

  const exportCSV = () => {
    const header = 'Email,Tier,Joined\n'
    const rows = users.map(u => `${u.email},${u.tier},${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'flip-labs-users.csv'; a.click()
  }

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl sm:text-3xl text-white mb-1">
          🛡️ <span className="gold-text">Admin</span> Panel
        </h2>
        <p className="text-white/40 font-body text-sm">Manage users, tiers, and exports.</p>
      </motion.div>

      {/* Stats + export */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex items-center justify-between gap-3 p-4 rounded-2xl"
        style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.18)' }}>
        <div>
          <div className="font-display text-3xl gold-text">{users.length}</div>
          <div className="text-white/40 font-body text-xs">Total Users</div>
        </div>
        <button onClick={exportCSV}
          className="px-4 py-2.5 rounded-full text-sm font-body font-bold min-h-[44px]"
          style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}>
          Export CSV ↓
        </button>
      </motion.div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search users by email…"
        className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder-white/20 outline-none"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
      />

      {/* User list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-white/30 font-body text-sm text-center py-6">No users found.</p>
        )}
        {filtered.map((u, i) => (
          <motion.div key={u.email} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-2xl p-4 space-y-3"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-white/80 font-body text-sm font-semibold truncate">{u.email}</div>
                <div className="text-white/30 font-body text-xs mt-0.5">
                  Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <button onClick={() => setConfirmDelete(u.email)}
                className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-body font-bold min-h-[32px] flex items-center"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
                Delete
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={pendingTiers[u.email] ?? u.tier}
                onChange={e => handleTierChange(u.email, e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-sm font-body text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {TIER_OPTIONS.map(t => <option key={t} value={t} style={{ background: '#111' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
              <button onClick={() => handleSave(u.email)}
                disabled={!pendingTiers[u.email] || pendingTiers[u.email] === u.tier}
                className="px-4 py-2 rounded-xl text-sm font-body font-bold min-h-[40px] transition-all"
                style={{
                  background: saved[u.email] ? 'rgba(52,211,153,0.15)' : 'rgba(255,215,0,0.1)',
                  border: `1px solid ${saved[u.email] ? 'rgba(52,211,153,0.3)' : 'rgba(255,215,0,0.25)'}`,
                  color: saved[u.email] ? '#34d399' : '#FFD700',
                  opacity: (!pendingTiers[u.email] || pendingTiers[u.email] === u.tier) && !saved[u.email] ? 0.4 : 1,
                }}>
                {saved[u.email] ? '✓ Saved' : 'Save'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete confirm dialog */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.8)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-6 space-y-4"
              style={{ background: '#111', border: '1px solid rgba(239,68,68,0.3)' }}>
              <h3 className="font-display text-xl text-white">Delete User?</h3>
              <p className="text-white/50 font-body text-sm break-all">{confirmDelete}</p>
              <p className="text-white/35 font-body text-xs">This removes them from localStorage. It cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 rounded-xl font-body font-semibold text-sm"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                  Cancel
                </button>
                <button onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-3 rounded-xl font-body font-bold text-sm"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#ef4444' }}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const [member, setMember]                           = useState(null)
  const [loading, setLoading]                         = useState(true)
  const [error, setError]                             = useState('')
  const [tab, setTab]                                 = useState('home')
  const [completed, setCompleted]                     = useState(new Set())
  const [completedMilestones, setCompletedMilestones] = useState(new Set())
  const [burst, setBurst]                             = useState(null)
  const [activeLesson, setActiveLesson]               = useState(null)
  const [activeLessonModule, setActiveLessonModule]   = useState(null)
  const [showOnboarding, setShowOnboarding]           = useState(false)

  // Flat list of all accessible lessons for Next Lesson navigation
  const allAccessibleLessons = member
    ? COURSE_MODULES.filter(m => canAccess(m.tier, member.tier)).flatMap(m => m.lessons.map(l => ({ lesson: l, mod: m })))
    : []
  const activeLessonIndex = activeLesson
    ? allAccessibleLessons.findIndex(({ lesson }) => lesson.id === activeLesson.id)
    : -1

  useEffect(() => {
    try {
      const prog = JSON.parse(localStorage.getItem('fl_progress') || '{}')
      setCompleted(new Set(Object.keys(prog).filter(k => prog[k])))
      const ms = JSON.parse(localStorage.getItem('fl_milestones') || '{}')
      setCompletedMilestones(new Set(Object.keys(ms).filter(k => ms[k])))
    } catch {}
  }, [])

  useEffect(() => {
    const session = getSession()
    if (!session) { navigate('/login', { replace: true }); return }

    if (session.tier === 'admin') {
      fetch(`${API}/admin-member-content?email=${encodeURIComponent(session.email)}`)
        .then(r => r.json())
        .then(data => {
          if (data.error) { setError('Admin access error.'); setLoading(false); return }
          setMember({ ...data, email: session.email })
          setLoading(false)
        })
        .catch(() => {
          setMember({
            tier: 'admin', planDisplay: '👑 Admin', subscriptionId: 'admin',
            email: session.email, customerEmail: session.email,
            content: { categories: [], lockedCategories: [], guides: [] },
          })
          setLoading(false)
        })
      return
    }

    const stored = localStorage.getItem('rm_subscription')
    if (!stored) {
      const freeMember = { ...FREE_MEMBER, customerEmail: session.email, tier: session.tier === 'free' ? 'free' : session.tier }
      setMember(freeMember)
      setLoading(false)
      return
    }
    const parsed = JSON.parse(stored)

    fetch(`${API}/subscription-status?sub_id=${parsed.subscriptionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { localStorage.removeItem('rm_subscription'); setMember({ ...FREE_MEMBER, customerEmail: session.email }); setLoading(false); return }
        const fresh = { ...parsed, ...data, verifiedAt: Date.now(), customerEmail: session.email }
        localStorage.setItem('rm_subscription', JSON.stringify(fresh))
        setMember(fresh); setLoading(false)
      })
      .catch(() => {
        const age = Date.now() - (parsed.verifiedAt || 0)
        if (age < 3600000 && parsed.content) { setMember({ ...parsed, customerEmail: session.email }); setLoading(false) }
        else { setError('Could not connect. Check your connection.'); setLoading(false) }
      })
  }, [])

  useEffect(() => {
    if (member && !localStorage.getItem('fl_onboarding_done')) setShowOnboarding(true)
  }, [member])

  const handleCloseOnboarding = () => {
    localStorage.setItem('fl_onboarding_done', '1')
    setShowOnboarding(false)
  }

  const markComplete = useCallback(lessonId => {
    setCompleted(prev => {
      const next = new Set(prev); next.add(lessonId)
      const obj = {}; next.forEach(id => { obj[id] = true })
      localStorage.setItem('fl_progress', JSON.stringify(obj))
      return next
    })
  }, [])

  const toggleMilestone = useCallback(id => {
    setCompletedMilestones(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id); setBurst(id); setTimeout(() => setBurst(null), 700) }
      const obj = {}; next.forEach(mid => { obj[mid] = true })
      localStorage.setItem('fl_milestones', JSON.stringify(obj))
      return next
    })
  }, [])

  const openLesson = (lesson, mod) => {
    setActiveLesson(lesson); setActiveLessonModule(mod)
    localStorage.setItem('fl_last_lesson', JSON.stringify({ lessonId: lesson.id, moduleId: mod.id }))
  }

  const openLessonByIndex = (index) => {
    if (index < 0 || index >= allAccessibleLessons.length) return
    const { lesson, mod } = allAccessibleLessons[index]
    openLesson(lesson, mod)
  }

  const handleManageBilling = async () => {
    if (!member.subscriptionId || member.subscriptionId === 'admin') { return }
    try {
      const res  = await fetch(`${API}/create-portal-session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription_id: member.subscriptionId }) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch { alert('Could not open billing portal. Try again.') }
  }

  const handleSignOut = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  const tabs = [
    ...TABS,
    ...(member?.tier === 'admin' ? [{ id: 'admin', label: 'Admin', icon: '🛡️' }] : []),
  ]

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-5">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(255,215,0,0.12)' }} />
          <div className="absolute inset-0 rounded-full animate-spin" style={{ border: '2px solid transparent', borderTopColor: '#FFD700' }} />
        </div>
        <p className="text-white/40 font-body text-sm tracking-wide">Verifying your access...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-5 text-center gap-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="font-display text-3xl text-white">Access Error</h2>
        <p className="text-white/45 font-body text-sm max-w-sm">{error}</p>
        <button onClick={() => navigate('/')} className="btn-gold-outline px-8 py-3 rounded-full font-body text-sm min-h-[48px]">Back to Homepage</button>
      </div>
    )
  }

  const renderTab = () => {
    switch (tab) {
      case 'vendors':
        return <VendorsSection member={member} />

      case 'learn':
        return (
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-display text-2xl sm:text-3xl text-white mb-1">Your <span className="gold-text">Courses</span></h2>
              <p className="text-white/40 font-body text-sm">
                {completed.size} of {COURSE_MODULES.reduce((a, m) => a + m.lessons.length, 0)} lessons completed.
              </p>
            </motion.div>
            <PlatformComparison />
            <div className="space-y-3 mt-2">
              {COURSE_MODULES.map((mod, i) => (
                <motion.div key={mod.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <ModuleCard mod={mod} userTier={member.tier} completed={completed} onSelectLesson={openLesson} />
                </motion.div>
              ))}
            </div>
            <ResellGlossary />
          </div>
        )

      case 'supplier':
        return <SupplierSection userTier={member.tier} />

      case 'tools':
        return <ToolsSection userTier={member.tier} />

      case 'milestones':
        return <MilestonesSection userTier={member.tier} completedMilestones={completedMilestones} onToggleMilestone={toggleMilestone} burst={burst} />

      case 'account':
        return <AccountSection member={member} onManageBilling={handleManageBilling} onSignOut={handleSignOut} />

      case 'admin':
        return <AdminSection />

      default:
        return <HomeSection member={member} setTab={setTab} completed={completed} completedMilestones={completedMilestones} />
    }
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 fixed inset-y-0 left-0 z-40 py-6 px-4"
        style={{ background: 'rgba(8,8,8,0.98)', borderRight: '1px solid rgba(255,215,0,0.08)' }}>
        <div className="mb-6 px-1"><Logo /></div>
        <div className="px-1 mb-5"><PlanBadge tier={member.tier} planDisplay={member.planDisplay} /></div>
        <nav className="flex-1 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all min-h-[44px] ${tab === t.id ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
              style={tab === t.id ? { background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.18)' } : {}}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <a href="/" className="block text-white/20 hover:text-white/50 font-body text-xs transition-colors px-3 mt-4">← Back to site</a>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4"
        style={{ background: 'rgba(8,8,8,0.98)', borderBottom: '1px solid rgba(255,215,0,0.08)' }}>
        <Logo />
        <PlanBadge tier={member.tier} planDisplay={member.planDisplay} />
      </div>

      {/* Main content */}
      <main className="md:ml-56 min-h-screen pt-14 md:pt-0 pb-24 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 22, stiffness: 200 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{ background: 'rgba(8,8,8,0.98)', borderTop: '1px solid rgba(255,215,0,0.1)', paddingBottom: 'env(safe-area-inset-bottom)', transform: 'translateZ(0)', willChange: 'transform' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[60px] transition-all active:scale-[0.93]"
            style={{ color: tab === t.id ? '#FFD700' : 'rgba(255,255,255,0.35)' }}>
            <span className="text-lg leading-none" style={{ transform: tab === t.id ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.15s' }}>{t.icon}</span>
            <span className="font-body text-[9px] font-medium leading-none mt-0.5">{t.label}</span>
            {tab === t.id && <div className="w-4 h-0.5 rounded-full mt-1" style={{ background: '#FFD700' }} />}
          </button>
        ))}
      </motion.div>

      {/* Onboarding modal */}
      <AnimatePresence>
        {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} setTab={setTab} />}
      </AnimatePresence>

      {/* Lesson modal */}
      <AnimatePresence>
        {activeLesson && activeLessonModule && (
          <LessonModal
            lesson={activeLesson}
            module={activeLessonModule}
            allLessons={allAccessibleLessons}
            lessonIndex={activeLessonIndex}
            onClose={() => { setActiveLesson(null); setActiveLessonModule(null) }}
            onComplete={(id) => { markComplete(id) }}
            isCompleted={completed.has(activeLesson.id)}
            onNextLesson={(index) => {
              const { lesson, mod } = allAccessibleLessons[index]
              setActiveLesson(lesson); setActiveLessonModule(mod)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
