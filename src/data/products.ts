import { Product, Review } from '../types';

export const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: 'Sparkles', count: 36 },
  { id: 'organizers-storage', name: 'Organizers & Storage', icon: 'LayoutGrid', count: 15 },
  { id: 'wall-decor-collage', name: 'Wall Decor & Collages', icon: 'Image', count: 8 },
  { id: 'butterfly-decor', name: 'Butterfly Wall Decor', icon: 'Sparkles', count: 3 },
  { id: 'led-lighting', name: 'LED Lights & Lamps', icon: 'Zap', count: 5 },
  { id: 'lifestyle-vanity', name: 'Vanity & Personal Care', icon: 'Heart', count: 6 },
] as const;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'hd-silicone-scrubber',
    name: 'Silicone Body & Scalp Exfoliating Massage Scrubber',
    category: 'lifestyle-vanity',
    categoryName: 'Vanity & Personal Care',
    priceNGN: 2500,
    priceUSD: 1.67,
    rating: 4.9,
    reviewCount: 95,
    image: '/images/silicone_body_scrubber.jpg',
    additionalImages: ['/images/silicone_body_scrubber.jpg'],
    description: 'Soft ergonomic handheld silicone body and scalp massage brush. Dual-action flexible bristles deeply cleanse pores, exfoliate skin, stimulate scalp circulation, and lather soap luxuriously in the shower.',
    shortDescription: 'Ergonomic handheld silicone bath & scalp scrubber brush in purple and pastel pink for ₦2,500.',
    features: [
      'Soft 100% food-grade hygienic silicone bristles—antibacterial and easy to clean',
      'Ergonomic back handle slip-resistant grip fits comfortably in your palm',
      'Dual-action gentle exfoliation for body shower & scalp lathering',
      'Available in Royal Purple and Blossom Pink'
    ],
    specs: [
      { label: 'Price', value: '₦2,500' },
      { label: 'Material', value: '100% Hygienic Silicone' },
      { label: 'Colors', value: 'Purple / Pastel Pink' }
    ],
    colorOptions: [
      { name: 'Royal Purple', hex: '#9333ea' },
      { name: 'Pastel Pink', hex: '#f472b6' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 65,
    tags: ['Silicone Scrubber 2.5k', 'Body Scrubber', 'Scalp Brush', 'Shower Essential', 'Best Seller'],
    installationType: 'Handheld / Hanging Loop'
  },
  {
    id: 'hd-cramp-belt',
    name: 'Period Cramp Relief Heating Belt',
    category: 'lifestyle-vanity',
    categoryName: 'Vanity & Personal Care',
    priceNGN: 12000,
    priceUSD: 8.00,
    rating: 5.0,
    reviewCount: 142,
    image: '/images/cramp_relief_belt.jpg',
    additionalImages: ['/images/cramp_relief_belt.jpg'],
    description: 'Electric cordless menstrual cramp relief waist heating pad with vibration massage, 3 temperature levels, digital LED display, USB charging cable, and a decorative gift box.',
    shortDescription: 'Cordless electric cramp relief waist heating belt with vibration massage & LED display.',
    features: [
      '3 Heating temperature levels (50°C, 55°C, 60°C) & vibration modes',
      'Soft breathable plush backing with adjustable elastic waistband',
      'Fast 3-second rapid heating for instant period cramp relief',
      'Includes USB charging cable and compact gift box packaging'
    ],
    specs: [
      { label: 'Price', value: '₦12,000' },
      { label: 'Heat Modes', value: '3 Speeds + Vibration' },
      { label: 'Power', value: 'Rechargeable USB Battery' },
      { label: 'Display', value: 'Digital Temperature Screen' }
    ],
    colorOptions: [{ name: 'Soft Pink', hex: '#ec4899' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 40,
    tags: ['Cramp Belt 12k', 'Period Pain Relief', 'Self Care', 'Best Seller'],
    installationType: 'Wearable Strap'
  },
{
    id: 'hd-mirror-cat',
    name: 'Detachable Cat Ear Vanity Mirror',
    category: 'lifestyle-vanity',
    categoryName: 'Vanity & Personal Care',
    priceNGN: 3000,
    priceUSD: 2.00,
    rating: 4.9,
    reviewCount: 98,
    image: '/images/detachable_cat_mirror.jpg',
    additionalImages: ['/images/detachable_cat_mirror.jpg'],
    description: 'Cute pink round vanity tabletop mirror with adorable cat ears, 360-degree rotation stem, branching jewelry holder hooks, and a circular base tray for rings, earrings, and lipsticks.',
    shortDescription: 'Cute pink detachable cat ear desktop vanity mirror with jewelry holder stand & tray.',
    features: [
      '360-Degree dual-sided swivel mirror head with cat ears',
      'Branching stem hooks for hanging rings, necklaces, and hair ties',
      'Circular base tray organizes makeup, lip balms, and small jewelry',
      'Detachable lightweight design—easy to disassemble for travel'
    ],
    specs: [
      { label: 'Price', value: '₦3,000' },
      { label: 'Height', value: 'approx 30cm / 12 inches' },
      { label: 'Material', value: 'Shatter-resistant ABS + HD Glass' }
    ],
    colorOptions: [{ name: 'Kawaii Pink', hex: '#f472b6' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 65,
    tags: ['Detachable Mirror 3k', 'Cat Ears', 'Vanity Decor', 'Jewelry Stand'],
    installationType: 'Countertop Stand'
  },
{
    id: 'hd-towel-2in1',
    name: '2 in 1 Soft Plush Towel Set',
    category: 'lifestyle-vanity',
    categoryName: 'Vanity & Personal Care',
    priceNGN: 5000,
    priceUSD: 3.33,
    rating: 4.8,
    reviewCount: 110,
    image: '/images/towel_2in1_set.jpg',
    additionalImages: ['/images/towel_2in1_set.jpg'],
    description: 'Ultra-soft absorbent coral velvet 2-in-1 towel bundle including 1 large bath towel and 1 matching face/hand towel. Neatly packaged in sheer ribbon pouches with "Home Textiles" gift tags.',
    shortDescription: '2-in-1 soft plush bath & face towel set packaged in gift ribbons for ₦5,000.',
    features: [
      '2-Piece matching set: 1 Bath Towel + 1 Face/Hand Towel',
      'Microfiber coral fleece material—super absorbent and quick drying',
      'Gentle on sensitive face skin, hair, and body',
      'Available in pastel colors: Pink, Soft Blue, Lavender, Mint, White'
    ],
    specs: [
      { label: 'Set Includes', value: '1 Bath Towel + 1 Face Towel' },
      { label: 'Price', value: '₦5,000' },
      { label: 'Material', value: 'Microfiber Coral Fleece' }
    ],
    colorOptions: [
      { name: 'Soft Pink', hex: '#f472b6' },
      { name: 'Sky Blue', hex: '#38bdf8' },
      { name: 'Lilac Purple', hex: '#c084fc' },
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Mint Green', hex: '#34d399' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 85,
    tags: ['2 in 1 Towel 5k', 'Plush Microfiber', 'Gift Set', 'Dorm Essential'],
    installationType: 'Folded / Hanging'
  },
{
    id: 'hd-swab-jar-bow',
    name: 'Cotton Swab Jar - Transparent Acrylic Container with Pink Bow',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 5000,
    priceUSD: 3.33,
    rating: 4.9,
    reviewCount: 62,
    image: '/images/acrylic_swab_jar.jpg',
    additionalImages: ['/images/acrylic_swab_jar.jpg'],
    description: 'Aesthetic crystal clear acrylic cotton swab jar container with lid topped with a cute 3D pink bow accent. Holds cotton swab Q-tips, cotton pads, hair ties, or makeup sponges cleanly on your vanity desk.',
    shortDescription: 'Clear acrylic cotton swab jar & pad storage container decorated with a pink bow for ₦5,000.',
    features: [
      'Crystal-clear shatterproof acrylic body with dust-proof lid',
      'Adorned with a cute 3D soft pink bow accent',
      'Perfect size for cotton swab Q-tips, cotton rounds, beauty blenders, and clips',
      'Elevates your vanity counter or bathroom aesthetic'
    ],
    specs: [
      { label: 'Price', value: '₦5,000' },
      { label: 'Item', value: 'Cotton Swab Jar' },
      { label: 'Material', value: 'Clear Acrylic' },
      { label: 'Accent', value: '3D Pink Bow' }
    ],
    colorOptions: [{ name: 'Clear with Pink Bow', hex: '#ec4899' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 50,
    tags: ['Cotton Swab Jar', 'Cotton Swab Jar 5k', 'Acrylic Jar 5k', 'Swab Holder', 'Pink Bow Jar', 'Vanity Storage'],
    installationType: 'Countertop Stand'
  },
{
    id: 'hd-jewelry-palette',
    name: 'Aesthetic Ceramic Wavy Jewelry Palette Dish',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 3000,
    priceUSD: 2.00,
    rating: 4.9,
    reviewCount: 78,
    image: '/images/wavy_jewelry_palette.jpg',
    additionalImages: ['/images/wavy_jewelry_palette.jpg'],
    description: 'Organic wavy-edged ceramic glazed jewelry dish. Designed as a stylish tray to hold daily gold chains, rings, bracelets, keys, or lipstick accessories on your bedside table or vanity.',
    shortDescription: 'Glossy wavy cloud-shaped ceramic jewelry trinket dish for ₦3,000.',
    features: [
      'Trendy aesthetic wavy cloud border shape',
      'Smooth ceramic glazed finish—protects delicate jewelry from scratches',
      'Keeps everyday gold necklaces, rings, and earrings organized in one place',
      'Compact footprint fits easily on nightstands and dressers'
    ],
    specs: [
      { label: 'Price', value: '₦3,000' },
      { label: 'Material', value: 'Glazed Ceramic' },
      { label: 'Shape', value: 'Wavy Palette' }
    ],
    colorOptions: [{ name: 'Cream Gloss White', hex: '#fafafa' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 60,
    tags: ['Jewelry Palette 3k', 'Trinket Dish', 'Aesthetic Tray', 'Vanity Storage'],
    installationType: 'Countertop Stand'
  },
  {
        id: 'hd-org-04',
    name: '360° Rotating Cosmetic & Skincare Organizer',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 18000,
    priceUSD: 12.00,
    rating: 4.9,
    reviewCount: 135,

    image: '/images/rotating_makeup_organizer.jpg',
    additionalImages: ['/images/rotating_makeup_organizer.jpg'],
    description: 'Multi-tier clear acrylic spinning makeup carousel organizer. Rotates 360 degrees smoothly to hold perfumes, skincare bottles, serums, lipsticks, brushes, and vanity accessories.',
    shortDescription: 'Large 360° spinning clear acrylic vanity & skincare organizer carousel for ₦18,000.',
    features: [
      '360-Degree smooth ball-bearing spin base',
      'Multi-tiered storage holds 30+ skincare bottles, perfumes, and brushes',
      'Shatterproof crystal clear acrylic with elegant gold or clear tray borders',
      'Saves up to 75% of vanity desktop counter space'
    ],
    specs: [
      { label: 'Price', value: '₦18,000' },
      { label: 'Rotation', value: '360° Smooth Carousel' },
      { label: 'Material', value: 'Heavy Duty Clear Acrylic' }
    ],
    colorOptions: [{ name: 'Crystal Clear', hex: '#e2e8f0' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 45,
    tags: ['Rotating Organizer 18k', '360 Rotation', 'Vanity Storage', 'Best Seller'],
    installationType: 'Countertop Stand'
  },
{
    id: 'hd-shoe-rack',
    name: 'Multi-Tier Portable Shoe Rack Organizer',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 7000,
    priceUSD: 4.67,
    rating: 4.9,
    reviewCount: 124,
    image: '/images/shoe_rack_7k.jpg',
    additionalImages: ['/images/shoe_rack_7k.jpg'],
    description: 'Compact 4-tier portable shoe rack organizer with side frames and sturdy stainless steel poles. Keeps shoes, sneakers, and slippers neatly stacked in dorms, bedrooms, or hallways.',
    shortDescription: 'Multi-tier space-saving portable shoe rack for dorm rooms & entryway storage for ₦7,000.',
    features: [
      'Holds up to 12-16 pairs of shoes, sneakers, and slippers',
      'Stainless steel poles with durable side bracket frames',
      'Tool-free fast assembly in under 3 minutes',
      'Lightweight and easy to move around small spaces'
    ],
    specs: [
      { label: 'Price', value: '₦7,000' },
      { label: 'Tiers', value: '4 Tiers' },
      { label: 'Capacity', value: '12-16 Pairs of Shoes' },
      { label: 'Assembly', value: 'Tool-Free Snap-In' }
    ],
    colorOptions: [
      { name: 'Classic Black', hex: '#18181b' },
      { name: 'Vibrant Green', hex: '#22c55e' },
      { name: 'Magenta Pink', hex: '#ec4899' },
      { name: 'Sky Blue', hex: '#38bdf8' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 50,
    tags: ['Shoe Rack 7k', 'Dorm Organizer', 'Space Saver', 'Best Seller'],
    installationType: 'Free-Standing Rack'
  },
{
    id: 'hd-bag-organizer',
    name: 'Bag Organizer 6-Grid Hanging Closet Holder',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 8000,
    priceUSD: 5.33,
    rating: 4.9,
    reviewCount: 98,
    image: '/images/bag_organizer_8k.jpg',
    additionalImages: ['/images/bag_organizer_8k.jpg'],
    description: '6-pocket hanging closet handbag and purse organizer with clear transparent plastic slots. Hangs on standard closet rods or behind doors to protect handbags from dust.',
    shortDescription: '6-pocket hanging clear purse & handbag organizer for closet or door for ₦8,000.',
    features: [
      '6 Large clear PVC grid pockets for easy visibility',
      'Rotatable heavy-duty metal hook hangs on closet rod or door',
      'Breathable non-woven fabric backing protects leather and canvas bags',
      'Dust-proof, moisture-proof, and space-saving vertical storage'
    ],
    specs: [
      { label: 'Price', value: '₦8,000' },
      { label: 'Capacity', value: '6 Pockets / 6 Grid' },
      { label: 'Material', value: 'Dust-proof Non-woven Fabric + Clear PVC' }
    ],
    colorOptions: [
      { name: 'Sleek Black', hex: '#18181b' },
      { name: 'Pure White', hex: '#ffffff' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 42,
    tags: ['Bag Organizer 8k', '6 Grid', 'Closet Storage', 'Dust Proof'],
    installationType: 'Hanging Hook'
  },
  {
        id: 'hd-hooks-4pcs',
    name: 'Heavy-Duty Transparent Wall Hooks (4pcs Pack)',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 1000,
    priceUSD: 0.67,
    rating: 4.8,
    reviewCount: 165,

    image: '/images/hooks_4pcs_1k.jpg',
    additionalImages: ['/images/hooks_4pcs_1k.jpg'],
    description: 'Set of 4 heavy-duty transparent self-adhesive utility wall hooks. Perfect for dorm rooms and rented apartments—holds keys, bags, towels, utensils, and fairy lights with zero wall damage.',
    shortDescription: '4pcs pack of transparent self-adhesive trace-free wall hooks for ₦1,000.',
    features: [
      'Pack of 4 transparent adhesive wall hooks for just ₦1,000',
      'Supports up to 10 lbs per hook',
      'Waterproof and oil-proof stainless steel hook on clear backing pad',
      '100% trace-free removal with no drilling or sticky mess'
    ],
    specs: [
      { label: 'Price', value: '₦1,000' },
      { label: 'Quantity', value: '4 Pieces per Pack' },
      { label: 'Mounting', value: 'Self-Adhesive Trace-Free Pad' }
    ],
    colorOptions: [{ name: 'Transparent Clear', hex: '#e2e8f0' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 150,
    tags: ['Hooks 4pcs 1k', 'Damage Free', 'Student Essential'],
    installationType: 'Self-Adhesive Trace-Free Pad'
  },
{
    id: 'hd-wooden-peg-rack',
    name: 'Wall Hanger - Expandable Wooden Peg Coat & Bag Hanger Rack',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 4500,
    priceUSD: 3.00,
    rating: 4.8,
    reviewCount: 76,
    image: '/images/wooden_peg_rack.jpg',
    additionalImages: ['/images/wooden_peg_rack.jpg'],
    description: 'Classic wall hanger & expandable pine wood accordion peg coat rack hanger. Adjusts in width to fit entryways, dorm walls, or bedroom doors for hanging coats, hats, keys, towels, and bags.',
    shortDescription: 'Expandable wooden wall hanger accordion peg rack for coats, keys & bags for ₦4,500.',
    features: [
      'Natural solid wood accordion frame adjusts in length',
      'Multiple sturdy wooden pegs for organizing coats, keys, and bags',
      'Easy wall mount with rear hanging hooks',
      'Aesthetic warm wood aesthetic for cozy dorm interiors'
    ],
    specs: [
      { label: 'Price', value: '₦4,500' },
      { label: 'Type', value: 'Wall Hanger' },
      { label: 'Material', value: '100% Natural Pine Wood' },
      { label: 'Design', value: 'Expandable Accordion Frame' }
    ],
    colorOptions: [{ name: 'Natural Oak Wood', hex: '#d97706' }],
    isNewArrival: true,
    inStock: true,
    stockCount: 35,
    tags: ['Wall Hanger', 'Wall Hanger 4.5k', 'Wooden Peg Rack', 'Accordion Coat Rack', 'Key Hanger'],
    installationType: 'Wall Mount'
  },
{
    id: 'hd-nano-tape',
    name: 'Heavy-Duty Double-Sided Nano Tape (1 Roll)',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 1000,
    priceUSD: 0.67,
    rating: 4.9,
    reviewCount: 110,
    image: '/images/nano_tape_roll.jpg',
    additionalImages: ['/images/nano_tape_roll.jpg'],
    description: 'Heavy-duty transparent acrylic nano double-sided tape roll. Strong adhesive grip for mounting photo collages, power strip extension boxes, carpets, and wall decor without leaving residue or peeling paint.',
    shortDescription: 'Reusable washable double-sided clear nano tape roll for wall decor & organizing for ₦1,000.',
    features: [
      '1 Roll of heavy-duty clear double-sided nano adhesive tape',
      'Trace-free and damage-free removal—perfect for rented dorm walls',
      'Washable and reusable—simply rinse with water and air dry',
      'Cuts easily to any desired size for posters, hooks, and cables'
    ],
    specs: [
      { label: 'Price', value: '₦1,000 per 1pcs' },
      { label: 'Color', value: '100% Crystal Clear' },
      { label: 'Feature', value: 'Washable & Reusable' }
    ],
    colorOptions: [{ name: 'Transparent Clear', hex: '#e2e8f0' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 120,
    tags: ['Nano Tape 1k', 'Double Sided Tape', 'Damage Free', 'Student Essential'],
    installationType: 'Self-Adhesive Tape'
  },
{
    id: 'hd-storage-basket',
    name: 'Pastel Foldable Desktop Storage Basket Crate',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 2500,
    priceUSD: 1.67,
    rating: 4.8,
    reviewCount: 95,
    image: '/images/storage_basket_crate.jpg',
    additionalImages: ['/images/storage_basket_crate.jpg'],
    description: 'Aesthetic pastel plastic woven storage basket crate. Stackable and collapsible design for desk organization, stationery, makeup bottles, snacks, and closet accessories.',
    shortDescription: 'Pastel plastic desktop stackable storage crate basket for ₦2,500.',
    features: [
      'Stackable and collapsible plastic basket crate design',
      'Ventilated woven pattern keeps items visible and clean',
      'Ideal for study desk clutter, skincare bottles, and dorm snacks',
      'Available in Sky Blue, Pastel Pink, Cream Yellow, and Mint'
    ],
    specs: [
      { label: 'Price', value: '₦2,500' },
      { label: 'Design', value: 'Collapsible & Stackable Crate' },
      { label: 'Material', value: 'Durable ABS Plastic' }
    ],
    colorOptions: [
      { name: 'Sky Blue', hex: '#38bdf8' },
      { name: 'Pastel Pink', hex: '#f472b6' },
      { name: 'Cream Yellow', hex: '#fef08a' },
      { name: 'Mint Green', hex: '#34d399' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 80,
    tags: ['Storage Basket 2.5k', 'Desk Organizer', 'Collapsible Crate'],
    installationType: 'Desktop Stack'
  },
{
    id: 'hd-hanging-shelf',
    name: 'Rustic Wooden Rope Hanging Wall Shelf',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 5000,
    priceUSD: 3.33,
    rating: 4.9,
    reviewCount: 88,
    image: '/images/hanging_wooden_shelf.jpg',
    additionalImages: ['/images/hanging_wooden_shelf.jpg'],
    description: 'Minimalist floating wooden shelf held by thick natural jute ropes with a white seamless wall hook. Perfect for displaying small decor, potted plants, radios, and photo frames.',
    shortDescription: 'Rustic floating wooden wall shelf suspended by jute rope for ₦5,000 per 1.',
    features: [
      'Natural solid pine wooden board with smooth finish',
      'Heavy-duty natural jute rope suspends shelf evenly from a single wall hook',
      'Comes with non-damaging adhesive or pin wall hook',
      'Price is ₦5,000 per 1 shelf'
    ],
    specs: [
      { label: 'Price', value: '₦5,000 per 1' },
      { label: 'Material', value: 'Pine Wood + Jute Rope' },
      { label: 'Includes', value: 'Wall Hook' }
    ],
    colorOptions: [{ name: 'Natural Wood', hex: '#d97706' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 45,
    tags: ['Hanging Shelf 5k', 'Floating Shelf', 'Jute Rope', 'Room Aesthetics'],
    installationType: 'Single Wall Hook'
  },
{
    id: 'hd-mesh-organizer',
    name: 'Space Saving Mesh Closet Drawer Organizer',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 3000,
    priceUSD: 2.00,
    rating: 4.8,
    reviewCount: 104,
    image: '/images/space_saving_mesh.jpg',
    additionalImages: ['/images/space_saving_mesh.jpg'],
    description: 'Multi-grid breathable nylon mesh closet drawer storage box. Neatly organizes socks, underwear, leggings, ties, or scarfs inside wardrobes and drawers.',
    shortDescription: 'Multi-compartment space-saving mesh drawer organizer box for ₦3,000.',
    features: [
      'Breathable mesh fabric—washable and fold-flat when not in use',
      'Multiple compartments keep underwear, socks, and ties separated',
      'Fits inside standard wardrobe drawers, suitcases, and closet shelves',
      'Durable double-stitched fabric edge binding'
    ],
    specs: [
      { label: 'Price', value: '₦3,000' },
      { label: 'Material', value: 'Breathable Nylon Mesh' },
      { label: 'Feature', value: 'Collapsible & Washable' }
    ],
    colorOptions: [
      { name: 'Charcoal Grey', hex: '#4b5563' },
      { name: 'Clean White', hex: '#ffffff' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 90,
    tags: ['Space Saving Mesh 3k', 'Drawer Organizer', 'Closet Storage'],
    installationType: 'Drawer Insert'
  },
{
    id: 'hd-wallpaper',
    name: 'Self-Adhesive Marble Contact Paper Wallpaper Rolls',
    category: 'wall-decor-collage',
    categoryName: 'Wall Decor & Collages',
    priceNGN: 5500,
    priceUSD: 3.67,
    rating: 4.9,
    reviewCount: 88,
    image: '/images/wallpaper_rolls.jpg',
    additionalImages: ['/images/wallpaper_rolls.jpg'],
    description: 'Waterproof self-adhesive marble contact paper wallpaper rolls. Upgrade desk tops, countertops, dorm walls, and wardrobes in minutes. Choose Small Roll (0.6m x 3m - ₦5,500) or Big Roll (0.6m x 5m/10m - ₦10,000).',
    shortDescription: 'Waterproof peel-and-stick marble wallpaper rolls: Small (₦5,500) & Big (₦10,000).',
    features: [
      'Thick waterproof PVC glossy surface is easy to wipe clean',
      'Peel and stick self-adhesive backing—no glue or tools required',
      'Available in Black Gold Marble, Emerald Jade Green, and Misty Grey Gold',
      'Roll dimensions: Small (0.6m x 3m - ₦5,500), Big (0.6m x 5m/10m - ₦10,000)'
    ],
    specs: [
      { label: 'Small Roll (0.6m x 3m)', value: '₦5,500' },
      { label: 'Big Roll (0.6m x 5m)', value: '₦10,000' },
      { label: 'Finish', value: 'Glossy Waterproof PVC Marble' }
    ],
    sizeOptions: ['Small Roll 0.6m x 3m (₦5,500)', 'Big Roll 0.6m x 5m (₦10,000)'],
    colorOptions: [
      { name: 'Black Gold Marble', hex: '#18181b' },
      { name: 'Jade Green Marble', hex: '#10b981' },
      { name: 'Grey Gold Marble', hex: '#94a3b8' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 60,
    tags: ['Wallpaper Small 5.5k', 'Big 10k', 'Marble Contact Paper', 'Peel and Stick'],
    installationType: 'Peel & Stick Adhesive'
  },
{
    id: 'hd-custom-collage',
    name: 'Customized Wall Collage Pack (10pcs)',
    category: 'wall-decor-collage',
    categoryName: 'Wall Decor & Collages',
    priceNGN: 8000,
    priceUSD: 5.33,
    rating: 4.9,
    reviewCount: 92,
    image: '/images/ultimate_dorm_glowup.jpg',
    additionalImages: ['/images/ultimate_dorm_glowup.jpg', '/images/custom_wall_collage.jpg'],
    description: 'Customized aesthetic wall art collage cards (10pcs pack). High-definition prints including Vogue, Matisse, Dior, and motivational art prints. Shown styled in dorm rooms with hanging botanical vines, butterfly wall decals, and sunset glow lights.',
    shortDescription: '10pcs Customized aesthetic wall collage poster art pack with adhesive dots for ₦8,000.',
    features: [
      '10 High-definition custom aesthetic print cards (Vogue, Dior, Matisse, quotes)',
      'Styled seamlessly with hanging vines, butterfly decals, and ambient glow',
      'Includes 1 sheet of non-marking round adhesive mounting dots',
      'DM us on WhatsApp for custom photo print requests!'
    ],
    specs: [
      { label: 'Price', value: '₦8,000' },
      { label: 'Quantity', value: '10 Cards per Pack' },
      { label: 'Paper', value: 'Thick Glossy Cardstock' }
    ],
    colorOptions: [{ name: 'Aesthetic Wall Art Mix', hex: '#f472b6' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 40,
    tags: ['Custom Collage 8k', '10pcs Cards', 'Room Glow Up', 'Aesthetic Room'],
    installationType: 'Adhesive Dots'
  },
{
    id: 'hd-glow-stars',
    name: '3D Glow in the Dark Stars Pack',
    category: 'wall-decor-collage',
    categoryName: 'Wall Decor & Collages',
    priceNGN: 2500,
    priceUSD: 1.67,
    rating: 4.8,
    reviewCount: 140,
    image: '/images/glow_dark_stars.jpg',
    additionalImages: ['/images/glow_dark_stars.jpg'],
    description: '4-pack set of 3D glow-in-the-dark stars (Green, Blue, Pink, and Multi-Color mix). Charges under ambient light and glows brightly on bedroom ceilings and walls at night. Comes with square adhesive pads.',
    shortDescription: 'Glow in the dark 3D stars pack (4 bags in Green, Blue, Pink & Mixed) for ₦2,500.',
    features: [
      'Includes 4 clear bags of fluorescent star stickers',
      'Color pack: Luminous Green, Aqua Blue, Soft Pink, and Rainbow Mix',
      'Long-lasting nocturnal glow powered by daylight or room light',
      'Comes with non-damaging double-sided foam adhesive grid pads'
    ],
    specs: [
      { label: 'Price', value: '₦2,500' },
      { label: 'Quantity', value: '4 Bags / 100+ Stars' },
      { label: 'Includes', value: 'Foam Adhesive Pads' }
    ],
    colorOptions: [
      { name: 'Luminous Green', hex: '#4ade80' },
      { name: 'Aqua Blue', hex: '#38bdf8' },
      { name: 'Soft Pink', hex: '#f472b6' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 100,
    tags: ['Glow Stars 2.5k', 'Ceiling Stars', 'Night Glow', 'Dorm Wall Decor'],
    installationType: 'Foam Adhesive Pads'
  },
{
    id: 'hd-cherry-vine-garland',
    name: 'Floral Pink Leaf Vine Garland Strand',
    category: 'wall-decor-collage',
    categoryName: 'Wall Decor & Collages',
    priceNGN: 5000,
    priceUSD: 3.33,
    rating: 4.9,
    reviewCount: 78,
    image: '/images/pink_leaf_vines.jpg',
    additionalImages: ['/images/pink_leaf_vines.jpg', '/images/cherry_blossom_vines.jpg'],
    description: 'Realistic silk pink botanical leaf foliage & flower vine garland strand in protective pack (approx 2m / 6.5ft). Perfect for framing vanity mirrors, door arches, bedroom windows, or creating romantic floral photo walls in dorm rooms.',
    shortDescription: 'Pink silk leaf & flower vine garland strand for room & mirror decor for ₦5,000.',
    features: [
      '1 Pack / strand of realistic pink botanical silk leaf vine garland (approx 2m / 6.5ft)',
      'High quality silk foliage that does not fade or drop off easily',
      'Flexible stem drapes effortlessly around mirrors, headboards, and curtain rods',
      'Price is ₦5,000 per strand'
    ],
    specs: [
      { label: 'Price', value: '₦5,000 per strand' },
      { label: 'Length', value: 'approx 2 Meters / 6.5 Feet' },
      { label: 'Material', value: 'Silk Foliage Petals + Flexible Vine Stem' }
    ],
    colorOptions: [{ name: 'Blossom Pink Foliage', hex: '#f472b6' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 60,
    tags: ['Pink Vines 5k', 'Floral Garland', 'Botanical Decor', 'Mirror Decor'],
    installationType: 'Drape / Hook Mount'
  },
{
    id: 'hd-pink-bow-wall',
    name: 'Pink Bow Ribbon Wall Decor Set (20pcs)',
    category: 'wall-decor-collage',
    categoryName: 'Wall Decor & Collages',
    priceNGN: 3000,
    priceUSD: 2.00,
    rating: 4.9,
    reviewCount: 82,
    image: '/images/pink_bow_wall.jpg',
    additionalImages: ['/images/pink_bow_wall.jpg'],
    description: 'Set of 20 pre-tied pink and magenta satin bow wall hanging ribbons. Create a trendy coquette aesthetic wall pattern above your bed, vanity, or study desk with included sticky dots.',
    shortDescription: '20pcs Pack of pink pre-tied satin bow ribbon wall hanging decorations for ₦3,000.',
    features: [
      '20 Pre-tied satin ribbon bows in soft pink and deep crimson',
      'Brings the popular coquette room aesthetic to your bedroom or dorm',
      'Includes 1 sheet of non-marking double-sided wall tape dots',
      'Lightweight and reusable without damaging paint'
    ],
    specs: [
      { label: 'Price', value: '₦3,000' },
      { label: 'Quantity', value: '20 Bows per Pack' },
      { label: 'Material', value: 'Satin Ribbon' }
    ],
    colorOptions: [
      { name: 'Pastel Pink & Magenta', hex: '#f472b6' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 65,
    tags: ['Pink Bow Wall 3k', '20pcs Bows', 'Coquette Decor', 'Room Vibe'],
    installationType: 'Adhesive Dots'
  },
{
    id: 'hd-bow-flag-banner',
    name: 'Bow Ribbon Pull Flag Wall Garland Banner',
    category: 'wall-decor-collage',
    categoryName: 'Wall Decor & Collages',
    priceNGN: 3500,
    priceUSD: 2.33,
    rating: 4.8,
    reviewCount: 54,
    image: '/images/bow_ribbon_garland.jpg',
    additionalImages: ['/images/bow_ribbon_garland.jpg'],
    description: 'Delicate sheer bow ribbon pull flag hanging garland banner. Strung along transparent wire, available in White, Soft Pink, Classic Black, and Golden tones for birthday, dorm, or bedroom styling.',
    shortDescription: 'Sheer ribbon bow pull flag garland banner wall hanging for ₦3,500.',
    features: [
      'Pre-assembled pull flag garland with multiple sheer bows',
      'Drapes gracefully across walls, bed headboards, or photo backdrops',
      'Color options: Soft Pink, Pure White, Sleek Black, Champagne Gold',
      'Easy to hang with tape or small hooks'
    ],
    specs: [
      { label: 'Price', value: '₦3,500' },
      { label: 'Design', value: 'Bow Ribbon Pull Flag Garland' },
      { label: 'Length', value: 'approx 2 Meters' }
    ],
    colorOptions: [
      { name: 'Soft Pink', hex: '#f472b6' },
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Classic Black', hex: '#18181b' },
      { name: 'Champagne Gold', hex: '#fbbf24' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 50,
    tags: ['Bow Ribbon Banner 3.5k', 'Pull Flag Garland', 'Wall Decor'],
    installationType: 'Hanging String'
  },
{
    id: 'hd-pink-butterflies',
    name: '3D Pink Textured Butterfly Wall Stickers (12pcs)',
    category: 'butterfly-decor',
    categoryName: 'Butterfly Wall Decor',
    priceNGN: 2500,
    priceUSD: 1.67,
    rating: 4.8,
    reviewCount: 89,
    image: '/images/pink_butterfly_12pcs.jpg',
    additionalImages: ['/images/pink_butterfly_12pcs.jpg'],
    description: 'Set of 12 delicate 3D pink textured paper/feather butterfly wall stickers with double-sided adhesive dots. Ideal for vanity mirrors, headboards, and study desk walls.',
    shortDescription: '12pcs Pack of delicate 3D pink textured butterfly wall stickers for ₦2,500.',
    features: [
      'Includes 12 pieces of textured 3D pink butterflies in various sizes',
      'Feather-textured wing design bends to create realistic 3D depth',
      'Includes double-sided removable adhesive dot pads',
      'Zero damage to painted walls, glass, or mirrors'
    ],
    specs: [
      { label: 'Price', value: '₦2,500' },
      { label: 'Quantity', value: '12 Pieces per Pack' },
      { label: 'Color', value: 'Textured Soft Pink' }
    ],
    colorOptions: [{ name: 'Soft Pink', hex: '#f472b6' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 65,
    tags: ['12pcs 2.5k', '3D Butterflies', 'Pink Aesthetic'],
    installationType: 'Adhesive Dots'
  },
{
    id: 'hd-butterfly-mandala',
    name: '3D Vibrant Butterfly Wall Decals Set (20pcs - 25pcs)',
    category: 'butterfly-decor',
    categoryName: 'Butterfly Wall Decor',
    priceNGN: 3000,
    priceUSD: 2.00,
    rating: 4.9,
    reviewCount: 112,
    image: '/images/red_butterfly_mandala.jpg',
    additionalImages: ['/images/red_butterfly_mandala.jpg'],
    description: 'Vibrant 3D butterfly wall stickers set. Choose from Random Rainbow Mix (25pcs - ₦3,000), Hot Pink Wheel (20pcs - ₦3,000), Red Wheel (20pcs - ₦3,000), or Yellow (20pcs - ₦3,000).',
    shortDescription: 'Colorful 3D butterfly wall sticker sets (20pcs or 25pcs pack) for ₦3,000.',
    features: [
      '20pcs or 25pcs per pack for ₦3,000',
      'Durable waterproof PVC material with foldable wings',
      'Comes with trace-free adhesive wall pads',
      'Available in Random Rainbow mix, Hot Pink, Red, or Yellow'
    ],
    specs: [
      { label: 'Price', value: '₦3,000' },
      { label: 'Pack Size', value: '20pcs or 25pcs' },
      { label: 'Material', value: 'Waterproof Flexible PVC' }
    ],
    sizeOptions: [
      'Random Mix (25pcs) - ₦3,000',
      'Hot Pink Wheel (20pcs) - ₦3,000',
      'Bright Red Wheel (20pcs) - ₦3,000',
      'Yellow Wheel (20pcs) - ₦3,000'
    ],
    colorOptions: [
      { name: 'Random Rainbow Mix', hex: '#ec4899' },
      { name: 'Hot Pink', hex: '#f43f5e' },
      { name: 'Bright Red', hex: '#ef4444' },
      { name: 'Sunshine Yellow', hex: '#eab308' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 80,
    tags: ['25pcs 3k', '3D Decals', 'Vibrant Colors'],
    installationType: 'Adhesive Dots'
  },
{
    id: 'hd-glowing-butterflies',
    name: 'Glowing LED Butterfly Wall Night Lights',
    category: 'butterfly-decor',
    categoryName: 'Butterfly Wall Decor',
    priceNGN: 3500,
    priceUSD: 2.33,
    rating: 4.9,
    reviewCount: 142,
    image: '/images/glowing_led_butterflies.jpg',
    additionalImages: ['/images/glowing_led_butterflies.jpg'],
    description: '3D glowing LED butterfly wall lights with built-in battery and switch base. Stick around light switches, vanity mirrors, or form a glowing heart pattern across your wall.',
    shortDescription: 'Glowing LED 3D butterfly wall night lights with warm multi-color illumination & switch base.',
    features: [
      'Built-in battery-powered LED module under each 3D butterfly',
      'Soft glowing night light in vibrant colors (Blue, Red, Yellow, Green, Pink, Purple)',
      'Simple peel-and-stick trace-free adhesive base',
      'Available as Single Light (₦3,500), 5pcs Switch Set (₦12,000), or 10pcs Heart Pack (₦18,000)'
    ],
    specs: [
      { label: 'Single Light', value: '₦3,500' },
      { label: '5pcs Set', value: '₦12,000' },
      { label: '10pcs Heart Pack', value: '₦18,000' }
    ],
    sizeOptions: [
      'Single Light (₦3,500)',
      '5pcs Wall Switch Set (₦12,000)',
      '10pcs Heart Wall Formation Pack (₦18,000)'
    ],
    colorOptions: [
      { name: 'Glowing Multi-Color', hex: '#38bdf8' },
      { name: 'Neon Purple & Pink', hex: '#ec4899' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 60,
    tags: ['LED Night Light', 'Glowing Butterfly', 'Best Seller'],
    installationType: 'Peel and Stick Base'
  },
{
    id: 'hd-letter-marquee',
    name: 'LED Glowing Letter Marquee Light (A-Z, 0-9)',
    category: 'led-lighting',
    categoryName: 'LED Lights & Lamps',
    priceNGN: 4000,
    priceUSD: 2.67,
    rating: 4.9,
    reviewCount: 95,
    image: '/images/letter_marquee_light.jpg',
    additionalImages: ['/images/letter_marquee_light.jpg'],
    description: 'Stand-alone glowing LED marquee letter light sign. Choose any letter from A-Z or number 0-9 to spell out names, initials, or year dates on desk tops or walls.',
    shortDescription: 'Glowing warm LED marquee letter light sign (A-Z, 0-9) for room personalization for ₦4,000.',
    features: [
      'Choose any alphabet letter (A to Z) or number (0 to 9)',
      'Warm white glowing LED bulbs with glitter pink / white frame finish',
      'Battery-powered (2x AA) with rear hanging hook slot or tabletop standing base',
      'Perfect for room decor, initials, name spelling, or birthday photo setups'
    ],
    specs: [
      { label: 'Price', value: '₦4,000 per Letter' },
      { label: 'Power', value: '2x AA Batteries (Cordless)' },
      { label: 'Height', value: 'approx 22cm / 8.6 inches' }
    ],
    colorOptions: [
      { name: 'Pink Glitter Frame', hex: '#f472b6' },
      { name: 'White Frame', hex: '#ffffff' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 120,
    tags: ['Letter Light 4k', 'Marquee Light', 'Initial Decor', 'Name Light'],
    installationType: 'Tabletop / Keyhole Wall Mount'
  },
{
    id: 'hd-sunset-lamp-1color',
    name: 'Sunset Projection Lamp (1-Color Warm)',
    category: 'led-lighting',
    categoryName: 'LED Lights & Lamps',
    priceNGN: 4000,
    priceUSD: 2.67,
    rating: 4.9,
    reviewCount: 142,
    image: '/images/sunset_lamp_1color.jpg',
    additionalImages: ['/images/sunset_lamp_1color.jpg'],
    description: 'Single warm color golden-hour sunset projection lamp (sunset lamp 1color - 4k). Creates a soothing amber sunset halo aura on bedroom and hostel walls. 180° rotatable head and USB powered.',
    shortDescription: '1-Color warm golden sunset projection lamp for dorm aesthetic (₦4,000).',
    features: [
      'Warm golden hour single-color sunset projection',
      '180-Degree rotatable metal optical lens head',
      'USB Powered with inline ON/OFF switch cord',
      'Compact desk base stand ideal for nightstands & desks'
    ],
    specs: [
      { label: 'Price', value: '₦4,000' },
      { label: 'Type', value: '1-Color Warm Golden Sunset' },
      { label: 'Power Source', value: '5V USB Powered' },
      { label: 'Material', value: 'Aluminum + Iron Base' }
    ],
    colorOptions: [
      { name: 'Warm Sunset Orange', hex: '#f97316' }
    ],
    isNewArrival: false,
    isBestSeller: true,
    inStock: true,
    stockCount: 50,
    tags: ['sunset lamp 1color - 4k', 'Sunset Lamp 4k', 'Sunset Lamp 4000', '1 Color Sunset', 'Golden Hour Lamp', 'Photography Light'],
    installationType: 'Desk Base Stand'
  },
{
    id: 'hd-fairy-lights',
    name: 'Warm LED Fairy String Lights (1pcs Strand)',
    category: 'led-lighting',
    categoryName: 'LED Lights & Lamps',
    priceNGN: 2500,
    priceUSD: 1.67,
    rating: 4.8,
    reviewCount: 145,
    image: '/images/fairy_light_vines.jpg',
    additionalImages: ['/images/fairy_light_vines.jpg'],
    description: 'Warm golden LED fairy lights string strand (1pcs battery-operated). Wrap around headboards, photo grids, artificial leaf vines, or mirrors for a glowing aesthetic.',
    shortDescription: '1pcs strand warm golden LED fairy string lights for room & wall decor for ₦2,500.',
    features: [
      '1pcs Flexible copper wire LED fairy light strand for ₦2,500',
      'Warm golden white glowing micro LED bulbs',
      'Low heat, energy efficient, safe to touch',
      'Battery-powered box with easy ON/OFF switch'
    ],
    specs: [
      { label: 'Price', value: '₦2,500' },
      { label: 'Quantity', value: '1 Strand' },
      { label: 'Power', value: 'Battery Box Switch' }
    ],
    colorOptions: [{ name: 'Warm Gold', hex: '#f59e0b' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 90,
    tags: ['Fairy Lights 2.5k', '1pcs Strand', 'Warm Glow', 'Dorm Decor'],
    installationType: 'Flexible Drape / Wall Clip'
  },
{
    id: 'hd-led-strip',
    name: 'Led Stripe light multicolor (5m)',
    category: 'led-lighting',
    categoryName: 'LED Lights & Lamps',
    priceNGN: 8000,
    priceUSD: 5.33,
    rating: 4.9,
    reviewCount: 156,
    image: '/images/led_strip_light.jpg',
    additionalImages: ['/images/led_strip_light.jpg'],
    description: 'Vibrant RGB LED strip light set (5 Meters reel) with wireless IR remote control and power adapter. Multiple color modes and flash patterns for dorm rooms.',
    shortDescription: '5m Multicolor LED strip light set with wireless remote control & power adapter for ₦8,000.',
    features: [
      '5 Meters (16.4 ft) flexible LED strip reel',
      'Wireless Infrared Remote Control with color presets',
      'Self-adhesive backing for easy damage-free wall installation',
      'Includes power adapter and remote control'
    ],
    specs: [
      { label: 'Price', value: '₦8,000' },
      { label: 'Length', value: '5 Meters / 16.4 Feet' },
      { label: 'Control', value: 'Wireless IR Remote Control' }
    ],
    colorOptions: [{ name: 'Multicolor RGB', hex: '#ec4899' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 50,
    tags: ['LED Strip 8k 5m', 'Multicolor', 'Remote Control', 'Best Seller'],
    installationType: 'Self-Adhesive Backing'
  },
{
    id: 'hd-3tier-trolley',
    name: '3-Tier Rolling Utility Storage Cart Trolley',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 12000,
    priceUSD: 8.00,
    rating: 4.9,
    reviewCount: 94,
    image: '/images/three_tier_trolley.jpg',
    additionalImages: ['/images/three_tier_trolley.jpg'],
    description: 'Heavy-duty 3-tier plastic rolling utility cart trolley on smooth 360° caster wheels. Perfect for dorm room storage, snacks, skincare, books, and craft supplies.',
    shortDescription: 'Multi-purpose 3-tier rolling utility cart trolley on wheels for ₦12,000.',
    features: [
      '3 deep spacious storage baskets with ventilated drainage bottoms',
      '4 smooth 360° lockable caster wheels for effortless mobility',
      'Sturdy heavy-duty frame designed for dorm rooms and bedrooms',
      'Easy tool-free snap assembly in minutes'
    ],
    specs: [
      { label: 'Price', value: '₦12,000' },
      { label: 'Tiers', value: '3 Storage Baskets' },
      { label: 'Features', value: '360° Caster Wheels + Handles' }
    ],
    colorOptions: [
      { name: 'Cream White', hex: '#fdfbf7' },
      { name: 'Sleek Black', hex: '#1c1917' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 40,
    tags: ['3 Step Trolley 12k', '3 Tier Trolley', 'Utility Cart', 'Storage Cart', 'Dorm Storage'],
    installationType: 'Freestanding Floor'
  },
  {
        id: 'hd-3drawer-bow-box',
    name: '3-Drawer Mini Storage Box with Pink Bow Knobs',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 4500,
    priceUSD: 3.00,
    rating: 4.8,
    reviewCount: 71,

    image: '/images/three_drawer_bow_box.jpg',
    additionalImages: ['/images/three_drawer_bow_box.jpg'],
    description: 'Kawaii 3-drawer desktop mini storage container box with cute 3D pink bow handles. Perfect for storing makeup, jewelry, hair clips, stationery, and small accessories.',
    shortDescription: 'Cute 3-drawer desktop mini storage box adorned with pink bow knobs for ₦4,500.',
    features: [
      '3 smooth sliding clear pull-out drawers for easy visibility',
      'Topped with adorable 3D soft pink bow drawer pull knobs',
      'Compact footprint keeps study desk or vanity completely clutter-free',
      'Durable dust-proof plastic construction'
    ],
    specs: [
      { label: 'Price', value: '₦4,500' },
      { label: 'Drawers', value: '3 Pull-Out Drawers' },
      { label: 'Handles', value: '3D Pink Bow Knobs' }
    ],
    colorOptions: [{ name: 'Soft White & Pink', hex: '#fbcfe8' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 50,
    tags: ['Storage Box 4.5k', 'Storage Box 4500', 'Bow Storage Box', 'Mini Drawer', 'Desk Storage'],
    installationType: 'Countertop Stand'
  },
  {
    id: 'hd-bathroom-corner-rack',
    name: 'Punch-Free Bathroom & Shower Corner Storage Rack',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 4000,
    priceUSD: 2.67,
    rating: 4.9,
    reviewCount: 88,
    image: '/images/corner_rack_real.jpg',
    additionalImages: ['/images/corner_rack_real.jpg'],
    description: 'Heavy-duty wall-mounted corner bathroom and shower caddy organizer rack. Features rustproof black wrought iron hollow drainage shelves with ultra-strong trace-free adhesive stickers for damage-free wall mounting.',
    shortDescription: 'Punch-free triangular corner bathroom shower caddy shelf with adhesive mounting pads for ₦4,000.',
    features: [
      'Space-saving 90-degree corner wall triangular mount design',
      'Rustproof matte black carbon steel hollow drainage frame',
      'Heavy-duty waterproof trace-free adhesive wall sticker pads included',
      'Holds shampoo, conditioners, body washes, and facial cleansers securely'
    ],
    specs: [
      { label: 'Price', value: '₦4,000' },
      { label: 'Mounting', value: 'Punch-Free Strong Adhesive Pads' },
      { label: 'Material', value: 'Rustproof Matte Black Steel' },
      { label: 'Bearing Load', value: 'Up to 10kg' }
    ],
    colorOptions: [{ name: 'Matte Black', hex: '#18181b' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 45,
    tags: ['Corner Rack 4k', 'Shower Caddy', 'Bathroom Organizer', 'Punch Free', 'Best Seller'],
    installationType: 'Wall Mount (Adhesive Pads)'
  },
  {
    id: 'hd-twotier-organizer',
    name: '2-Tier Desktop Makeup & Skincare Storage Organizer with Drawers',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 6500,
    priceUSD: 4.33,
    rating: 4.9,
    reviewCount: 92,
    image: '/images/twotier_makeup_organizer.jpg',
    additionalImages: ['/images/twotier_makeup_organizer.jpg'],
    description: 'Multi-compartment white vanity organizer featuring 2 smooth pull-out sliding drawers, deep top open trays for skincare serums, moisturizers, creams, lipsticks, and a dedicated brush holder slot.',
    shortDescription: 'Multi-compartment white desktop vanity organizer with 2 pull-out drawers for ₦6,500.',
    features: [
      '2 Smooth sliding dust-free pull-out drawer compartments',
      'Deep top-tier organizer for taller bottles, skincare creams, and sprays',
      'Side compartments for brushes, combs, perfumes, and lipsticks',
      'Sleek aesthetic white finish complements any modern bedroom vanity desk'
    ],
    specs: [
      { label: 'Price', value: '₦6,500' },
      { label: 'Drawers', value: '2 Pull-Out Drawers + Top Tray' },
      { label: 'Material', value: 'Durable Eco-Friendly ABS Plastic' }
    ],
    colorOptions: [{ name: 'Pure White', hex: '#ffffff' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 55,
    tags: ['Makeup Organizer 6.5k', 'Vanity Storage', '2 Tier Drawers', 'Skincare Caddy'],
    installationType: 'Countertop Stand'
  },
  {
    id: 'hd-aurora-projector',
    name: 'Northern Lights Aurora Galaxy Ambient Star Projector',
    category: 'led-lighting',
    categoryName: 'LED Lights & Lamps',
    priceNGN: 14000,
    priceUSD: 9.33,
    rating: 5.0,
    reviewCount: 118,
    image: '/images/aurora_projector.jpg',
    additionalImages: ['/images/aurora_projector.jpg'],
    description: 'Dazzling Northern Lights aurora borealis and starry night galaxy projector with multi-color lighting effects, dynamic ocean nebula waves, wireless remote control, brightness control, and timer functions.',
    shortDescription: 'Northern Lights Aurora Galaxy star ceiling projector with remote control for ₦14,000.',
    features: [
      'Vibrant multi-color Aurora Borealis and starry sky ceiling projection',
      'Wireless infrared remote control with speed, brightness, and color mode presets',
      'Soothing ambient mood lighting ideal for sleep, meditation, movie nights, and parties',
      'USB Powered with quiet motor mechanism'
    ],
    specs: [
      { label: 'Price', value: '₦14,000' },
      { label: 'Light Modes', value: 'Multi-Color Aurora + Star Waves' },
      { label: 'Control', value: 'Full-Function Remote Control' },
      { label: 'Power', value: '5V USB Cable' }
    ],
    colorOptions: [{ name: 'Cosmic Black', hex: '#0f172a' }],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 35,
    tags: ['Aurora Projector 14k', 'Galaxy Projector', 'Northern Lights', 'Ceiling Lamp', 'Best Seller'],
    installationType: 'Tabletop / Desktop Stand'
  },
  {
    id: 'hd-crystal-wave-lamp',
    name: '16-Color Ocean Wave Crystal Ball Ambient Night Lamp',
    category: 'led-lighting',
    categoryName: 'LED Lights & Lamps',
    priceNGN: 9500,
    priceUSD: 6.33,
    rating: 4.9,
    reviewCount: 104,
    image: '/images/projection_lamp.jpg',
    additionalImages: ['/images/projection_lamp.jpg'],
    description: 'Rotating dynamic water ripple & ocean wave crystal ball night lamp. Features 16 RGB color choices, 4 illumination modes (Flash, Strobe, Fade, Smooth), touch sensor button, and wireless remote control.',
    shortDescription: '16-Color dynamic water ripple crystal ball ambient lamp with 4 modes & remote for ₦9,500.',
    features: [
      '16 Rich RGB colors and 4 dynamic lighting modes (Flash, Strobe, Fade, Smooth)',
      'Faceted crystal dome casts mesmerizing water wave and ripple reflections across the room',
      'Dual control: Top touch button and wireless infrared remote control',
      'USB Powered—ideal bedside night light and aesthetic video background'
    ],
    specs: [
      { label: 'Price', value: '₦9,500' },
      { label: 'Color Options', value: '16 Colors + 4 Modes' },
      { label: 'Control', value: 'Touch Sensor + IR Remote' },
      { label: 'Material', value: 'Crystal Acrylic Dome + ABS Base' }
    ],
    colorOptions: [
      { name: 'Crystal White Base', hex: '#ffffff' },
      { name: 'Sleek Black Base', hex: '#18181b' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 40,
    tags: ['Crystal Wave Lamp 9.5k', '16 Colors', 'Ocean Ripple', 'Ambient Light', 'Best Seller'],
    installationType: 'Tabletop Stand'
  },
  {
    id: 'hd-mesh-laundry-hamper',
    name: 'Foldable Pop-Up Mesh Laundry Hamper Basket',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 3500,
    priceUSD: 2.33,
    rating: 4.8,
    reviewCount: 76,
    image: '/images/mesh_laundry_basket.jpg',
    additionalImages: ['/images/mesh_laundry_basket.jpg'],
    description: 'Breathable high-capacity black pop-up mesh laundry hamper basket. Features durable flexible steel spring frame, reinforced dual carry handles, and a convenient side pocket for laundry detergent pods or dryer sheets.',
    shortDescription: 'Pop-up foldable breathable mesh laundry basket hamper with handles & side pocket for ₦3,500.',
    features: [
      'Instant pop-up spring frame twists and folds completely flat for easy storage',
      'High-grade breathable polyester mesh prevents odors and moisture buildup',
      'Sturdy dual handles make transporting laundry to wash points effortless',
      'Convenient side pocket for detergent pods, delicates, or keys'
    ],
    specs: [
      { label: 'Price', value: '₦3,500' },
      { label: 'Material', value: 'Breathable Polyester Mesh + Steel Wire' },
      { label: 'Design', value: 'Pop-Up Fold-Flat Hamper' }
    ],
    colorOptions: [
      { name: 'Matte Black', hex: '#18181b' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 60,
    tags: ['Laundry Hamper 3.5k', 'Mesh Basket', 'Pop Up Hamper', 'Dorm Storage'],
    installationType: 'Freestanding Floor'
  },
  {
    id: 'hd-clear-gold-crate',
    name: 'Luxury Fluted Clear Acrylic Organizer Bin with Gold Handles',
    category: 'organizers-storage',
    categoryName: 'Organizers & Storage',
    priceNGN: 4500,
    priceUSD: 3.00,
    rating: 5.0,
    reviewCount: 129,
    image: '/images/clear_gold_handle_box.jpg',
    additionalImages: ['/images/clear_gold_handle_box.jpg'],
    description: 'High-end stackable fluted crystal clear acrylic storage container basket with polished electroplated gold side handles. Elegant aesthetic for organizing perfumes, body sprays, colognes, makeup palettes, and vanity essentials.',
    shortDescription: 'Luxury fluted transparent acrylic storage crate with gold metal handles for ₦4,500.',
    features: [
      'Premium ribbed fluted crystal clear acrylic with luxurious gold metal handles',
      'Stackable modular design to maximize shelf, vanity, and drawer storage space',
      'Perfect size for perfumes, colognes, lotions, makeup palettes, and bathroom toiletries',
      'Shatter-resistant, lightweight, and easy to clean with a damp cloth'
    ],
    specs: [
      { label: 'Price', value: '₦4,500' },
      { label: 'Material', value: 'Fluted Crystal Acrylic + Gold Metal' },
      { label: 'Design', value: 'Stackable Luxury Crate' }
    ],
    colorOptions: [
      { name: 'Crystal Clear & Gold', hex: '#fbbf24' }
    ],
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 70,
    tags: ['Gold Handle Box 4.5k', 'Luxury Fluted Crate', 'Perfume Organizer', 'Vanity Bin', 'Best Seller'],
    installationType: 'Countertop / Shelf Stand'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'hd-cramp-belt',
    userName: 'Toluwalase A.',
    rating: 5,
    date: '2026-08-05',
    title: 'Lifesaver during my period!',
    comment: 'The heating belt heats up in seconds! The vibration modes really help soothe cramp pain. Compact, cute pink, and charges via USB. Best purchase ever!',
    verifiedPurchase: true,
    helpfulCount: 32
  },
  {
    id: 'rev-2',
    productId: 'hd-mirror-cat',
    userName: 'Amina B.',
    rating: 5,
    date: '2026-08-04',
    title: 'Cutest vanity mirror on my desk',
    comment: 'The cat ears and jewelry branches are so useful for my earrings and rings! Mirror reflection is super clear. Assembly took 10 seconds.',
    verifiedPurchase: true,
    helpfulCount: 28
  },
  {
    id: 'rev-3',
    productId: 'hd-towel-2in1',
    userName: 'Chidinma K.',
    rating: 5,
    date: '2026-08-02',
    title: 'So plush and soft on skin',
    comment: 'The 2 in 1 set came tied so nicely with ribbons. Super soft microfleece that absorbs water instantly without shedding fibers.',
    verifiedPurchase: true,
    helpfulCount: 21
  },
  {
    id: 'rev-4',
    productId: 'hd-org-04',
    userName: 'Blessing M.',
    rating: 5,
    date: '2026-08-01',
    title: 'Spins smoothly and holds all my skincare!',
    comment: 'The 360 rotation is completely silent! My vanity table was so cluttered before, now all my serums and lipsticks are organized cleanly.',
    verifiedPurchase: true,
    helpfulCount: 19
  }
];

export const DISCOUNT_CODES: Record<string, number> = {};
