export const LEGAL_CONTENT = {
  privacy: {
    title: "Privacy Policy",
    content: `
Last Updated: December 2024

At Dani Candles, we respect your privacy and are committed to protecting your personal information.

Information We Collect:
- Name and contact information
- Billing and shipping addresses
- Payment information (processed securely)
- Order history and preferences

How We Use Your Information:
- Process and fulfill your orders
- Send order confirmations and updates
- Improve our products and services
- Send promotional emails (with your consent)

Data Security:
We implement industry-standard security measures to protect your personal information.

Your Rights:
You have the right to access, correct, or delete your personal information at any time.

Contact Us:
If you have questions about our privacy practices, please contact us at privacy@danicandles.com
    `,
  },
  terms: {
    title: "Terms & Conditions",
    content: `
Last Updated: December 2024

Welcome to Dani Candles. By accessing our website and purchasing our products, you agree to these terms.

Product Information:
All candles are handcrafted in small batches. Colors and scents may vary slightly from photos.

Pricing:
All prices are in USD unless otherwise stated. We reserve the right to change prices without notice.

Orders:
- Orders are processed within 1-3 business days
- You will receive a confirmation email upon order placement
- We reserve the right to refuse or cancel any order

Intellectual Property:
All content on this website is the property of Dani Candles and protected by copyright laws.

Limitation of Liability:
Dani Candles is not liable for any indirect, incidental, or consequential damages arising from the use of our products.

Changes to Terms:
We may update these terms at any time. Continued use of our website constitutes acceptance of updated terms.

Contact:
For questions, contact us at info@danicandles.com
    `,
  },
  shipping: {
    title: "Shipping & Returns",
    content: `
Last Updated: December 2024

Shipping Information:

Processing Time:
Orders are processed within 1-3 business days (Monday-Friday, excluding holidays).

Shipping Methods:
- Standard Shipping (5-7 business days)
- Express Shipping (2-3 business days)
- Overnight Shipping (1 business day)

Shipping Costs:
Calculated at checkout based on order weight and destination.

International Shipping:
We currently ship within the United States only. International shipping coming soon.

Returns & Exchanges:

Return Policy:
We accept returns within 30 days of delivery for unused, unopened products in original packaging.

How to Return:
1. Contact us at returns@danicandles.com
2. Receive return authorization and instructions
3. Ship items back (customer pays return shipping)
4. Refund processed within 5-7 business days

Damaged or Defective Products:
If you receive a damaged or defective product, contact us within 48 hours of delivery. We'll provide a replacement or full refund at no cost to you.

Non-Returnable Items:
- Opened or used candles
- Sale or clearance items
- Custom orders

Exchanges:
We gladly exchange products for the same item in a different size or scent, subject to availability.

Contact:
Questions? Email us at support@danicandles.com
    `,
  },
};

export const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Interior Designer",
    content:
      "These candles have completely transformed my clients' spaces. The scents are sophisticated and long-lasting. I recommend Dani Candles to everyone.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Yoga Instructor",
    content:
      "The perfect addition to my studio. The calming fragrances create exactly the ambiance I want for my classes. My students always ask where they can buy them.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Homeowner",
    content:
      "I've tried countless candle brands, but nothing compares to Dani Candles. The quality is exceptional, and they burn so cleanly. Absolutely worth every penny.",
    rating: 5,
  },
  {
    name: "Michael Thompson",
    role: "Coffee Shop Owner",
    content:
      "We use these in our café daily. Customers constantly compliment the atmosphere, and the candles last much longer than any other brand we've tried.",
    rating: 5,
  },
];

export const CANDLE_IMAGES = [
  "/image1.jpg",
  "/image2.jpg",
  "/image3.jpg",
  "/image4.jpg",
  "/image5.jpg",
];

export const FRAGRANCES = [
  {
    id: 1,
    name: "Peppermint",
    description:
      "Crisp and invigorating, our peppermint fragrance awakens the senses with its refreshing coolness. A perfect blend of natural mint essence that brings clarity and energy to any space.",
    benefits: [
      "Promotes mental clarity and focus",
      "Reduces stress and tension",
      "Creates an energizing atmosphere",
      "Natural deodorizing properties",
    ],
    imageUrl: "/fragrance1.jpg",
    notes: "Top: Fresh Mint · Heart: Eucalyptus · Base: Cool Menthol",
  },
  {
    id: 2,
    name: "Vanilla",
    description:
      "Warm and comforting, our vanilla fragrance envelops you in a sweet embrace. Made from premium Madagascar vanilla beans, it creates an atmosphere of pure indulgence and relaxation.",
    benefits: [
      "Soothes anxiety and promotes calmness",
      "Creates a welcoming, cozy ambiance",
      "Enhances feelings of comfort",
      "Timeless and universally loved scent",
    ],
    imageUrl: "/fragrance2.jpg",
    notes: "Top: Sweet Cream · Heart: Vanilla Bean · Base: Warm Sugar",
  },
  {
    id: 3,
    name: "Christmas Tree",
    description:
      "The essence of the holidays captured in a candle. Fresh pine needles and crisp winter air combine to bring the magic of a snow-dusted forest into your home.",
    benefits: [
      "Evokes nostalgic holiday memories",
      "Purifies and freshens air naturally",
      "Creates a festive atmosphere",
      "Grounding and centering effect",
    ],
    imageUrl: "/fragrance3.jpg",
    notes: "Top: Pine Needles · Heart: Cedar · Base: Winter Moss",
  },
  {
    id: 4,
    name: "Coffee",
    description:
      "Rich and robust, our coffee fragrance captures the warmth of freshly roasted beans. An aromatic blend that energizes and comforts, perfect for creating a cozy café ambiance at home.",
    benefits: [
      "Boosts energy and alertness",
      "Neutralizes unwanted odors",
      "Creates a warm, inviting space",
      "Stimulates productivity and focus",
    ],
    imageUrl: "/fragrance4.jpg",
    notes: "Top: Espresso · Heart: Roasted Beans · Base: Caramel",
  },
  {
    id: 5,
    name: "Lavender",
    description:
      "Tranquil and serene, our lavender fragrance is nature's gift for relaxation. Harvested from French lavender fields, this timeless scent promotes deep calm and peaceful rest.",
    benefits: [
      "Promotes restful sleep",
      "Reduces stress and anxiety",
      "Balances mood naturally",
      "Creates a spa-like sanctuary",
    ],
    imageUrl: "/fragrance5.jpg",
    notes: "Top: Fresh Lavender · Heart: Chamomile · Base: Soft Musk",
  },
  {
    id: 6,
    name: "Sandalwood",
    description:
      "Luxurious and grounding, our sandalwood fragrance offers a warm, woody sophistication. This premium scent brings depth and elegance to any space with its rich, creamy undertones.",
    benefits: [
      "Enhances meditation and mindfulness",
      "Promotes emotional balance",
      "Creates sophisticated ambiance",
      "Long-lasting, lingering fragrance",
    ],
    imageUrl: "/fragrance6.jpg",
    notes: "Top: Bergamot · Heart: Creamy Sandalwood · Base: Amber",
  },
];

export const CARE_SECTIONS = [
  {
    id: 1,
    title: "Choosing Your Perfect Candle",
    subtitle: "Finding the right scent for every moment",
    description:
      "Selecting the perfect candle goes beyond fragrance—it's about creating an experience. Consider the size of your space, the mood you want to create, and the time of day. Larger rooms benefit from candles with stronger scent throws, while intimate spaces shine with subtle, delicate fragrances.",
    tips: [
      "Morning rituals pair beautifully with fresh, energizing scents like peppermint or coffee",
      "Evening relaxation calls for calming notes such as lavender or vanilla",
      "Consider the season—warm, spicy scents for winter, light florals for spring",
      "Layer complementary fragrances in different rooms for a cohesive home experience",
    ],
    icon: "✨",
  },
  {
    id: 2,
    title: "The First Burn Ritual",
    subtitle: "Setting the foundation for a perfect burn",
    description:
      "The first burn is the most important. Allow your candle to burn until the entire top surface melts into a complete pool of wax—typically 2-4 hours. This prevents tunneling and ensures an even burn for the life of your candle. This initial burn creates a memory ring that the candle will follow for all future burns.",
    tips: [
      "Never burn a candle for less than one hour on the first light",
      "Ensure the wax pool reaches the edges of the container",
      "Place on a heat-resistant surface away from drafts",
      "Keep the wick centered as the wax melts",
    ],
    icon: "🕯️",
  },
  {
    id: 3,
    title: "Wick Maintenance",
    subtitle: "The secret to a clean, even burn",
    description:
      "A properly trimmed wick is essential for optimal candle performance. Before each burn, trim the wick to 1/4 inch using wick trimmers or scissors. This simple practice prevents smoking, reduces soot buildup, and ensures a steady, beautiful flame that maximizes your candle's fragrance throw.",
    tips: [
      "Trim the wick before every burn when the wax is cool and solid",
      "Remove any wick debris or char buildup from the wax pool",
      "A mushrooming wick is a sign it needs trimming",
      "Keep wick trimmers nearby as part of your candle care routine",
    ],
    icon: "✂️",
  },
  {
    id: 4,
    title: "Safe Burning Practices",
    subtitle: "Enjoying candles with peace of mind",
    description:
      "Safety is paramount when enjoying candles. Never leave a burning candle unattended, and always keep them away from children, pets, and flammable materials. Place candles on stable, heat-resistant surfaces, away from drafts, vents, and ceiling fans that can cause uneven burning or smoking.",
    tips: [
      "Never burn a candle for more than 4 hours at a time",
      "Keep candles at least 3 inches apart from each other",
      "Extinguish candles when leaving a room or before sleep",
      "Use a candle snuffer to avoid hot wax splatter",
      "Discontinue use when 1/2 inch of wax remains",
    ],
    icon: "🛡️",
  },
  {
    id: 5,
    title: "Maximizing Scent Throw",
    subtitle: "Getting the most from your fragrance",
    description:
      "To fully experience your candle's fragrance, consider your environment. Smaller, enclosed spaces will naturally have a stronger scent throw. For larger rooms, try burning multiple candles or placing them in central locations. Avoid competing scents from air fresheners or strong cooking odors during your first burn.",
    tips: [
      "Close doors and windows for the first 30 minutes of burning",
      "Place candles at nose level for optimal scent diffusion",
      "Burn candles in rooms you spend the most time in",
      "Allow the candle to burn long enough for proper scent release",
    ],
    icon: "🌸",
  },
  {
    id: 6,
    title: "Storage & Longevity",
    subtitle: "Preserving your candles between burns",
    description:
      "Proper storage extends the life and quality of your candles. Keep them in a cool, dry place away from direct sunlight, which can fade colors and alter fragrances. Always replace the lid between burns to preserve the scent and protect from dust. With proper care, your candles will maintain their integrity and fragrance.",
    tips: [
      "Store candles upright to prevent wax from settling unevenly",
      "Keep away from heat sources and direct sunlight",
      "Dust the wax surface gently with a soft cloth if needed",
      "Use candles within one year for optimal fragrance strength",
    ],
    icon: "📦",
  },
];

export const QUICK_TIPS = [
  {
    title: "Burn Time",
    description: "2-4 hours per session",
    icon: "⏱️",
  },
  {
    title: "Wick Length",
    description: "Trim to 1/4 inch",
    icon: "📏",
  },
  {
    title: "Wax Remaining",
    description: "Stop at 1/2 inch",
    icon: "🔥",
  },
  {
    title: "First Burn",
    description: "Full melt pool essential",
    icon: "💫",
  },
];

export const formatStatus = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "paid":
      return "Paid";
    case "shipped":
      return "Shipped";
    case "canceled":
      return "Canceled";
    case "refunded":
      return "Refunded";
    default:
      return status;
  }
};

export const statusColorClasses = (status: string) => {
  switch (status) {
    case "paid":
      return "border-emerald-500/30 text-emerald-700 bg-emerald-500/10";
    case "shipped":
      return "border-sky-500/30 text-sky-700 bg-sky-500/10";
    case "canceled":
      return "border-red-500/30 text-red-700 bg-red-500/10";
    case "refunded":
      return "border-purple-500/30 text-purple-700 bg-purple-500/10";
    default:
      return "border-amber-500/30 text-amber-800 bg-amber-500/10";
  }
};