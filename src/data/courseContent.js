export const TIER_ORDER = ['free', 'beginner', 'intermediate', 'pro']

export function canAccess(moduleTier, userTier) {
  return TIER_ORDER.indexOf(userTier ?? 'free') >= TIER_ORDER.indexOf(moduleTier)
}

export const COURSE_MODULES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    tier: 'free',
    icon: '🚀',
    lessons: [
      {
        id: 'what-is-reselling',
        title: 'What is reselling and why it works',
        readTime: '5 min',
        category: 'Mindset',
        body: `Reselling is the practice of buying products at a lower price and selling them for profit on secondary markets. Unlike traditional retail, resellers leverage price gaps between markets — sourcing wholesale, clearance, or overseas goods and listing them where motivated buyers are willing to pay full retail or above.

The model works because of market inefficiency. Not every buyer shops at the same place, and convenience has real monetary value. A pair of sneakers available at $60 wholesale can command $140-180 on platforms like eBay or StockX where buyers want them without hunting. A $15 fragrance sourced directly can sell for $45-60 the same week.

The entry barrier is low and the ceiling is high. With the right vendor list and basic hustle, people start generating $200-500 in their first two weeks. This is not passive income — it's active arbitrage. The more consistent you are, the more it compounds.`,
      },
      {
        id: 'first-100',
        title: 'How to make your first $100–500 with no investment',
        readTime: '8 min',
        category: 'Strategy',
        body: `Your first dollars don't require startup capital — they require resourcefulness. Start by looking around your home for items you no longer use: old shoes, electronics, clothing, video games, accessories. List them on Facebook Marketplace, eBay, or Depop tonight. This is called flipping your existing inventory and it teaches you the selling mechanics before you spend a dollar.

Once you've made your first $50–100, reinvest it into your first vendor order. Pick one category from your vendor list with a low minimum order — fragrances and accessories are great starting points. Order 2–5 units, list them immediately, and see what sells. Every dollar you make gets recycled back into inventory until you have a self-funding operation.

The goal of these first 30 days is not profit — it's education. You're learning your platform, your buyer base, your turnaround time, and your own hustle muscle. The money follows the reps.`,
      },
      {
        id: 'side-hustles',
        title: 'Best side hustles to stack startup cash',
        readTime: '6 min',
        category: 'Income',
        body: `If you need startup capital and have nothing to flip, here are the fastest ways to generate $100–300 in under a week alongside your reselling journey.

Facebook Marketplace "Free" section is one of the most underrated money-makers. People give away furniture, appliances, and electronics daily. Pick up free items, clean them up, relist for $50–200. Zero cost of goods, pure margin. TaskRabbit and local gigs (moving help, yard work, basic handyman) can generate $150–300 in a weekend. Selling digital products on Gumroad or Etsy — Canva templates, Notion dashboards, AI art — costs nothing to create and can sell repeatedly.

Stack $200–500 from these methods and you have your first real reselling budget. Treat it as seed capital. Protect it, move it fast, and compound it.`,
      },
      {
        id: 'ai-photos',
        title: 'How to use free AI tools for professional product photos',
        readTime: '7 min',
        category: 'Listings',
        body: `Photos are the single biggest conversion factor in reselling. A listing with bad photos gets ignored. A listing with clean, professional photos gets clicks and sales. The good news: you do not need a camera or a studio.

Use your phone near a window with natural light — this alone puts you ahead of 70% of sellers. Then use these free tools: Remove.bg removes backgrounds instantly and places your item on a clean white or custom background. Adobe Firefly or Canva AI generates professional lifestyle backgrounds in seconds. Snapseed (free app) handles exposure, contrast, and sharpness editing with one tap.

For clothing and shoes, stuff or pose the item to give it shape. For electronics, use a flat lay on a clean surface. Shoot 4–6 angles: front, back, sides, any logos, any flaws (honesty builds trust). Spend an extra 5 minutes on photos and your conversion rate will noticeably improve within the first week.`,
      },
    ],
  },
  {
    id: 'first-setup',
    title: 'Your First Setup',
    tier: 'beginner',
    icon: '⚙️',
    lessons: [
      {
        id: 'vendors-first',
        title: 'Understanding your vendors and what to buy first',
        readTime: '6 min',
        category: 'Vendors',
        body: `Your vendor list is your most valuable asset. Each vendor specializes in different product categories at different price points. The goal at the beginning is not to buy everything — it's to identify the 1–2 products with the best margin-to-risk ratio in your market.

Fragrances and electronics accessories (earbuds, phone cases, speakers) have low cost of goods, ship fast, and have consistent resale demand year-round. Clothing and hoodies have higher margins but require more attention to sizing and trend cycles. Shoes have the highest upside but also the most competition. Start where the risk is lowest and the sell-through is fastest.

Order 2–5 units of your first product. List them the same day they arrive. Track how long they take to sell. If something sits for over 2 weeks, reprice it down 10-15% to clear it. If it sells in under 3 days, order more next time. Use your first 30 days to learn your own sell-through speed, then scale from there.`,
      },
      {
        id: 'pricing',
        title: 'How to price your products for maximum profit',
        readTime: '8 min',
        category: 'Pricing',
        body: `Pricing is science, not intuition. The most important move you can make before setting any price is to check Sold Listings on eBay — not active listings, but actually sold ones. This shows you what buyers are willing to pay in the real market right now.

Target a 40–60% gross margin after all fees. The formula: (Sale Price) - (Platform Fee) - (Payment Fee) - (Shipping) - (Cost of Goods) = Your Profit. Platform fees vary: eBay is roughly 12–13%, Depop is 10%, Poshmark is 20% on items over $15. Payment processing adds another 2–3%. Use the fee calculators in your Guides section to model every order before you buy.

Never price based on what you paid. Price based on market demand. If the market says your item is worth $80, list it for $80 regardless of your cost. And don't be afraid to test: list at $90, drop to $75 after a week if no takers. The market tells you everything if you listen.`,
      },
      {
        id: 'listings',
        title: 'Writing listings that actually sell',
        readTime: '7 min',
        category: 'Listings',
        body: `Your listing title is your SEO. It's what gets you found. Research completed sales to see what keywords appear in titles of top-selling listings. Include: Brand + Product Name + Model/Style + Size or Color + Condition. Example: "Nike Air Force 1 Low White Sz 10 Deadstock Brand New." Pack in the keywords buyers search for — this directly impacts how high you rank.

Your description should answer buyer questions before they ask. Lead with the condition (Brand New / Like New / Good Used Condition). Include all relevant measurements if it's clothing or shoes. Note any flaws honestly — it prevents disputes and builds your seller reputation. Add a shipping timeline so buyers know what to expect.

Great sellers set themselves apart in two ways: professional photos and complete descriptions. If a buyer has to message you asking a question, your listing failed. Anticipate every question and answer it in the description. The more complete your listing, the fewer messages, the fewer disputes, and the faster you scale your feedback score.`,
      },
      {
        id: 'platforms',
        title: 'Platform guides — eBay, Depop, Facebook, Poshmark, Mercari',
        readTime: '9 min',
        category: 'Platforms',
        body: `Each platform has a different buyer base, fee structure, and best-performing product type. Cross-listing your inventory on 2–3 platforms simultaneously multiplies your chances of a sale without multiplying your work.

eBay: Largest global reach. Best for electronics, watches, shoes, and high-value items. ~12–13% selling fee. Use Promoted Listings to boost visibility on competitive items. Depop: Gen Z and millennial fashion buyers. Best for streetwear, vintage, designer, and hoodies. 10% fee. Aesthetic matters here — cohesive shop look helps. Facebook Marketplace: Local pickup, zero fees. Best for large items or bulk deals. Fast-moving, cash-in-hand buyers. Great for electronics. Poshmark: Fashion-focused community. 20% fee but has built-in buyer/follower network. Best for clothing and accessories. Mercari: Growing platform, 10% fee. Works well for electronics, sports gear, and miscellaneous items.

Start on eBay and Facebook Marketplace — lowest friction. Once you have cash flowing and feedback building, expand to Depop and Mercari. Treat each platform as a separate sales channel that feeds the same inventory.`,
      },
      {
        id: 'money-map',
        title: 'Your milestone money map — what to do with every dollar',
        readTime: '6 min',
        category: 'Finance',
        body: `Every dollar you make in reselling should have a job. The biggest mistake new resellers make is pulling out profit too early — before the operation is self-sustaining. Here's the map for your first 90 days.

First $100: Reinvest 80% back into inventory. Keep 20% as an operating buffer for supplies (packaging, labels). First $500: Expand to a second vendor category. Diversify your product mix. First $1,000: Upgrade your process — better photography setup, a thermal label printer, cross-listing software. First $2,500: Buy in bulk. Order 10+ units of your best-seller for better per-unit cost. First $5,000: Explore your first wholesale account, consider your first branded packaging run.

Compounding works the same way in reselling as it does in investing. Let the money ride for 90 days before you pull anything out for personal use. By day 90, you'll have a real operation that generates surplus — and that surplus can be drawn sustainably.`,
      },
      {
        id: 'first-sale-checklist',
        title: 'Your First Sale Checklist',
        readTime: '4 min',
        category: 'Operations',
        body: `Before you list your first item, run through every item on this checklist. Skipping steps here causes problems later — missing payments, damaged shipments, negative feedback. Do this right once and you won't need to again.

✅ You have 4–6 clear, well-lit photos from multiple angles. ✅ Your title includes the brand, model, size/color, and relevant keywords. ✅ Your price is based on sold comps — not just listed prices. ✅ You know the weight and dimensions of the packaged item for shipping quotes. ✅ Your shipping carrier is selected and a label can be printed. ✅ Your payment account (PayPal, bank, etc.) is connected and verified. ✅ You have packaging materials: box, bubble wrap or tissue, tape. ✅ You've read the platform's seller policies at least once.

Go through all 8. If anything is missing, fix it before you list. Your first sale sets the tone for your seller account. A smooth first transaction leads to your first review, which leads to credibility, which leads to faster sales. Get it right from the start.`,
      },
    ],
  },
  {
    id: 'scaling-up',
    title: 'Scaling Up',
    tier: 'intermediate',
    icon: '📈',
    lessons: [
      {
        id: 'advanced-pricing',
        title: 'Advanced pricing — undercut competitors and keep your margin',
        readTime: '8 min',
        category: 'Pricing',
        body: `At scale, pricing becomes a dynamic game. You're not just pricing for margin — you're pricing for velocity and market position. The goal is to move inventory fast enough that your capital is always working, while extracting the maximum margin each turn allows.

Study your top 5 competitors on each platform. Identify their pricing patterns — do they start high and drop? Do they offer bundles? What does their sold history look like? If a competitor has 200 sales at $75 and you're at $80, drop to $73 and own that price point. Even a small undercut, combined with better photos and more complete listings, will consistently pull buyers your way.

Use repricing windows: list at your target price on day 1. If no sale by day 7, drop 8%. By day 14, drop another 8%. By day 21, price to clear. Never let inventory sit dead for more than 3 weeks — idle product is dead capital.`,
      },
      {
        id: 'seo',
        title: 'eBay and Depop SEO — rank higher in search',
        readTime: '7 min',
        category: 'SEO',
        body: `Both eBay and Depop use internal search algorithms that determine which listings get shown first. Understanding these algorithms is one of the highest-leverage skills in reselling — a top-ranked listing sells 3–5x faster than an identical listing buried on page 3.

On eBay: The Cassini algorithm favors listings with high click-through rate, fast shipping, strong seller feedback, and complete item specifics. Fill out every item specific field. Use all 80 characters in your title. Offer free shipping (fold the shipping cost into your price). Maintain a 99%+ positive feedback score. Respond to buyer questions within 24 hours. On Depop: The algorithm rewards active accounts. Post new listings regularly. Refresh old listings by ending and relisting them. Use all 5 hashtags. Follow accounts in your niche. A Depop account that posts daily gets dramatically more impressions than one that posts weekly.

The platform rewards behavior that keeps buyers engaged. Be active, be complete, be fast.`,
      },
      {
        id: 'bulk-flipping',
        title: 'Flipping in bulk — buy 10, sell 10 fast',
        readTime: '6 min',
        category: 'Strategy',
        body: `Single-unit flipping teaches you the model. Bulk flipping is where money actually scales. When you buy 10 units of a proven seller, your per-unit cost drops (vendor pricing often discounts at quantity), your listings go up simultaneously, and you're collecting multiple sales from a single sourcing effort.

The key risk in bulk is inventory that doesn't move. Never bulk into an unproven product. Validate at 2–5 units first, confirm the sell-through, then bulk the reorder. If your 5 units sold in 10 days, you have proof — order 20 next time. Your cost drops, your listing stays active longer, and you build an efficient funnel.

Systemize your bulk operation: same listing template, same photo setup, same packaging process. When the same item repeats, every repeat is faster than the last. At 10 units, you're spending 30 minutes to process what used to take 3 hours of separate, fragmented work.`,
      },
      {
        id: 'bundling',
        title: 'Bundling strategy — sell more per transaction',
        readTime: '5 min',
        category: 'Strategy',
        body: `Bundling is one of the most underused strategies in reselling. Instead of selling a single item, you combine 2–3 complementary products and list them as a set at a slight discount to individual prices — but a higher total transaction value.

Examples: a fragrance bundle (3 different scents at a combined price that beats buying each separately), a phone accessory bundle (case + screen protector + earbuds), a shoe + lace bundle. Buyers perceive bundles as deals. You move more inventory per transaction, reduce your per-sale platform fees proportionally, and often increase total margin.

Bundles also stand out in search. Most sellers list individual items — a "3-Pack Fragrance Bundle" or "Complete iPhone Accessories Set" has less competition, unique keyword coverage, and appeals to gift-buyers. Test one bundle per product category. If it converts, build more.`,
      },
      {
        id: 'returns',
        title: 'Handling returns, disputes, and chargebacks',
        readTime: '6 min',
        category: 'Operations',
        body: `Returns and disputes are part of the business. How you handle them determines your seller reputation. A well-managed dispute can actually result in positive feedback from a previously unhappy buyer.

eBay's Money Back Guarantee means buyers can open cases. Always respond within 3 business days. If the item was accurately described and the buyer changed their mind, you can decline the return (depending on your policy). If there's a legitimate issue — wrong item, damaged in shipping — accept it immediately, send a prepaid return label, and refund promptly. This closes the case, protects your metrics, and often still results in neutral rather than negative feedback.

Chargebacks are more serious — they go through the payment processor, not the platform. To win a chargeback dispute you need: proof of delivery (tracking), a clear listing that matched what was sent, and documentation of all communications. Always ship with tracking. Never ship without it. That one habit prevents most chargeback losses.`,
      },
      {
        id: 'templates',
        title: 'Email and DM templates to close buyers faster',
        readTime: '5 min',
        category: 'Operations',
        body: `Response speed is one of the most underrated sales skills in reselling. Buyers who message you are hot leads — they've already found your item and have a question. Responding in under 1 hour dramatically increases your close rate.

Template for "Is this still available?": "Yes, still available! Ready to ship today — let me know if you'd like to purchase. Feel free to make an offer if you'd like." Template for "Can you do [lower price]?": "I can do [your counter] — that's the lowest I can go and still makes sense for me. Want me to set up the listing?" Template for follow-up on watchers: eBay lets you send offers to watchers. Send 5–10% off with a 24-hour expiry. Urgency converts.

Keep templates short, warm, and action-oriented. Never leave a buyer with a dead end — always give them a clear next step.`,
      },
      {
        id: 'resell-calendar',
        title: 'Resell calendar — best times to sell each product type',
        readTime: '5 min',
        category: 'Strategy',
        body: `Reselling has seasonality just like traditional retail. Knowing what sells when is the difference between sitting on inventory and turning it fast.

Electronics peak in November (Black Friday, Cyber Monday) and in January (post-holiday returns, tax refunds). Fragrances peak October–December (gift season) and around Valentine's Day. Sneakers and streetwear have two peaks: back-to-school (August) and holiday (November–December). Watches spike around Father's Day and Christmas. Jewelry peaks Valentine's Day, Mother's Day, and holiday season.

Use off-peak months to source heavy at lower prices. Sell into peaks when demand drives up your realized price. If you can afford to hold inventory, sourcing in February and selling in November for Christmas can double your margin on certain categories. Work with the calendar, not against it.`,
      },
      {
        id: 'competitor-research',
        title: 'Competitor research guide',
        readTime: '6 min',
        category: 'Research',
        body: `The fastest way to level up your reselling operation is to reverse-engineer what top sellers in your category are doing. This is legal, ethical, and standard practice in every industry.

On eBay: find a top seller in your niche (high feedback count, recent sales). Go to their store. Filter by "Sold Items." Study their best-sellers — what products, what price points, what listing style, what photo approach. On Depop: search your product category, sort by "Most Recent." Look at accounts with the most followers and most sold items. Note their aesthetic, hashtag strategy, posting frequency.

You're not copying — you're learning what the market already rewards. Then you iterate and improve. Better photos, more complete descriptions, faster shipping, more competitive pricing. Within 90 days of applying competitor research systematically, you will have measurably better listings than when you started.`,
      },
    ],
  },
  {
    id: 'real-business',
    title: 'Running a Real Business',
    tier: 'pro',
    icon: '👑',
    lessons: [
      {
        id: 'llc-taxes',
        title: 'Setting up your LLC, business bank account, taxes 101',
        readTime: '9 min',
        category: 'Finance',
        body: `Once you're generating consistent revenue — even $500/month — you should operate as a legal business entity. This protects your personal assets, allows you to deduct business expenses, and makes you look credible to wholesale suppliers and banks.

Forming an LLC in most US states costs $50–200 through your state's Secretary of State website. You do not need a lawyer. After forming, apply for a free EIN (Employer Identification Number) at IRS.gov. Open a separate business checking account — Mercury, Relay, or any local credit union work well. Never mix personal and business money. This makes taxes infinitely simpler.

Tax basics for resellers: you owe income tax on profit (revenue minus cost of goods and expenses). Deductible expenses include: cost of goods sold, shipping supplies, platform fees, software subscriptions, storage, and a home office deduction if applicable. Keep receipts for everything. Use a simple spreadsheet or QuickBooks Self-Employed to track monthly. Set aside 25–30% of profit for taxes quarterly. Note: This is general educational information — consult a CPA for advice specific to your situation.`,
      },
      {
        id: 'scaling-1k',
        title: 'Scaling to $1k/week — step by step roadmap',
        readTime: '8 min',
        category: 'Scaling',
        body: `$1,000 per week in reselling profit ($52k/year) is achievable within 6–12 months for someone who operates with discipline. Here's the roadmap broken into phases.

Phase 1 ($0–$500/month): Validate your products. Learn your platforms. Perfect your listings. This phase is about consistency, not volume. Phase 2 ($500–$2,000/month): Bulk into your proven sellers. Cross-list on 3+ platforms. Start building supplier relationships. Automate your listing process with templates. Phase 3 ($2,000–$4,000/month): Introduce 2–3 new vendor categories. Get approved for wholesale accounts. Hire a VA for $5–10/hr for repetitive tasks (listing, messaging). Phase 4 ($4,000+/month): You have a business, not a hustle. Systematize everything. Reinvest 60% of profit. Pay yourself a consistent draw from the remaining 40%.

The variable between phases 1 and 4 is not luck — it's operational discipline. The resellers who hit $1k/week are not smarter. They are more consistent.`,
      },
      {
        id: 'multi-platform',
        title: 'Multi-platform strategy — sell same item on 3+ platforms',
        readTime: '6 min',
        category: 'Strategy',
        body: `Cross-listing the same item on multiple platforms simultaneously is one of the highest-ROI strategies available to resellers. You do one round of photos and one listing, then distribute it to 3–5 platforms where different buyer populations will see it.

The mechanics: list on eBay, Depop, Mercari, Facebook Marketplace, and Poshmark simultaneously. When one sells, immediately end the other listings. Tools like Vendoo, Crosslist, or List Perfectly can automate cross-listing for ~$15–30/month and pay for themselves in accelerated sales velocity.

The advantage is dramatic. A listing that might take 12 days to sell on one platform can sell in 3 days when it's exposed to 5 different buyer pools. Faster sell-through means faster capital recycling. The biggest resellers treat platforms as channels — they don't pick one, they dominate all of them.`,
      },
      {
        id: 'your-brand',
        title: 'Building your own reselling brand and storefront',
        readTime: '7 min',
        category: 'Branding',
        body: `At a certain scale, being "a reseller" becomes a ceiling. Building a brand breaks that ceiling. A brand means buyers seek you out instead of finding you by accident. It means repeat customers, follower growth, and the ability to sell outside of platform marketplaces entirely.

Start with consistency: same username across all platforms, same logo, same packaging insert (a simple "thank you" card with your logo costs $30 for 500 units from Canva + Vistaprint). Build an Instagram or TikTok account around your niche — show your sourcing, your process, your wins. This content builds trust and a community that becomes your customer base.

The endgame for a branded reseller is a Shopify storefront where you own the customer relationship directly — no platform fees, no algorithm dependency. This is a 6–12 month build, not a 30-day sprint. But every branded action you take today compounds into a business that has real equity, not just active income.`,
      },
      {
        id: 'advanced-photos',
        title: 'Advanced product photography guide',
        readTime: '6 min',
        category: 'Listings',
        body: `Your photos are your brand. At the pro level, your listing photos should be indistinguishable from brand retail photography. This section covers how to get there with minimal equipment.

The three-setup approach: (1) White background studio — a $20 white poster board and window light. Used for all product detail and hero shots. (2) Lifestyle context — items placed or worn in a relevant environment (shoe on concrete, fragrance on a marble countertop). Shot with your phone's portrait mode. (3) Flat lay — item laid flat on a clean surface, shot from directly above. Great for clothing and accessories.

Editing workflow: shoot in natural light (never flash). Open in Lightroom Mobile (free). Increase exposure +0.3, contrast +15, clarity +10. Reduce highlights -20 to keep whites clean. Export at full resolution. The difference between a beginner's photos and a pro's photos is almost entirely lighting and editing — not camera quality.`,
      },
      {
        id: 'reinvesting',
        title: 'Reinvesting profits and growing your inventory',
        readTime: '5 min',
        category: 'Finance',
        body: `The single most common mistake resellers make when revenue grows is taking profit out too fast. Withdrawing cash before your operation is self-sustaining starves the business of the fuel it needs to compound.

The reinvestment framework: for your first 6 months, reinvest 70–80% of gross profit back into inventory and operational improvements. The remaining 20–30% covers your expenses (supplies, subscriptions, fees) and a modest personal draw. At month 7+, once your inventory is rotating consistently and your systems are solid, you can increase your personal draw to 30–40% while maintaining growth.

Operational improvements worth investing in: a thermal label printer ($80–120, pays back in time savings immediately), a reliable inventory tracking spreadsheet or software, faster shipping supplies in bulk. Every operational improvement either speeds up your throughput or reduces per-unit costs — both compound.`,
      },
      {
        id: 'cashflow',
        title: 'Cashflow management for resellers',
        readTime: '6 min',
        category: 'Finance',
        body: `Revenue is vanity. Profit is sanity. Cash is reality. Reselling has a specific cash challenge: you pay for inventory before you receive payment from buyers. This float can cause cash crunches even when a business is technically profitable.

The solution is a rolling cashflow tracker. Every week, record: money received from sales (inflow), money spent on inventory and expenses (outflow), and your available cash balance. If you're running tight, prioritize fast-selling inventory over high-margin slow movers — velocity keeps the cash flowing. A $20 profit in 3 days beats a $40 profit in 30 days when cash is tight.

Payout timing matters. eBay and Depop typically pay out within 2–3 business days. Facebook Marketplace is instant (local cash). Build your cash cycle around your platforms' payout schedules. Never buy more inventory than your next expected payout can cover.`,
      },
      {
        id: 'audit',
        title: 'Getting your personal reselling audit',
        readTime: '4 min',
        category: 'Strategy',
        body: `A reselling audit is a structured review of your entire operation: what's working, what's not, where money is leaking, and where your biggest growth opportunities are. Pro members are eligible for a personal audit with the Flip Labs team.

What a reselling audit covers: your current product mix and margin analysis, your platform performance (conversion rate, sell-through speed, return rate), your sourcing efficiency (cost of goods relative to market prices), your operational bottlenecks (time spent per listing, per shipment), and your 90-day growth roadmap.

To request your personal audit, use the Account tab to send your audit request. Include your current monthly revenue, your main platforms, and your top-selling categories. You'll receive a personalized review within 5–7 business days. This is one of the highest-leverage things you can do as a Pro member — outside eyes on your operation almost always find significant improvements.`,
      },
    ],
  },
]
