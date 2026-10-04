// Sample catalogue. Edit this list to add/change your real products.
const categories = ['Cricket', 'Badminton', 'Football', 'Basketball', 'Fitness', 'Running', 'Accessories']
const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN')
const imgs = (id) => ['a', 'b', 'c'].map((k) => `https://picsum.photos/seed/ds${id}${k}/700/700`)
const products = [
  [1, 'Pro Willow Cricket Bat', 'Cricket', 'DS', 7499, 9999, 4.7, 128, 12, 'best', 'Grade 1 English willow bat with a thick edge profile for powerful strokes.', ['SH', 'Harrow']],
  [2, 'Leather Cricket Ball (Pack of 6)', 'Cricket', 'DS', 1299, 1799, 4.4, 76, 40, 'new', 'Four-piece hand-stitched leather balls for match and practice use.', ['Standard']],
  [3, 'Carbon Badminton Racket', 'Badminton', 'Yonex', 3299, 4299, 4.6, 211, 20, 'best', 'Lightweight full carbon frame built for fast attacking play.', ['3U', '4U']],
  [4, 'Feather Shuttlecocks (Tube of 12)', 'Badminton', 'Yonex', 899, 1100, 4.3, 95, 60, 'new', 'Goose feather shuttles with stable flight and a durable cork base.', ['Medium']],
  [5, 'Match Football Size 5', 'Football', 'Nivia', 1599, 2199, 4.5, 140, 25, 'best', 'Thermo-bonded surface for true flight and consistent touch.', ['5', '4']],
  [6, 'Indoor-Outdoor Basketball', 'Basketball', 'Spalding', 2199, 2799, 4.4, 64, 0, 'new', 'Deep-channel composite leather ball with superior grip.', ['6', '7']],
  [7, 'Adjustable Dumbbell Set 20kg', 'Fitness', 'DS', 3999, 5499, 4.6, 88, 15, 'best', 'Anti-slip handles with secure locking plates for home training.', ['20kg']],
  [8, 'Batting Gloves Pro', 'Accessories', 'DS', 1199, 1599, 4.2, 52, 30, 'new', 'Padded palm and flexible fingers for comfort and control.', ['S', 'M', 'L']],
  [9, 'Lightweight Running Shoes', 'Running', 'Puma', 3499, 4999, 4.5, 167, 18, 'best', 'Breathable mesh upper with a cushioned sole for daily miles.', ['7', '8', '9', '10']],
  [10, 'Dry-Fit Training T-Shirt', 'Running', 'DS', 699, 999, 4.3, 59, 50, 'new', 'Sweat-wicking fabric that keeps you cool through every session.', ['S', 'M', 'L', 'XL']],
  [11, 'Cricket Helmet with Steel Grille', 'Cricket', 'DS', 1899, 2499, 4.6, 73, 14, 'new', 'Impact-absorbing shell with adjustable fit and a steel grille.', ['M', 'L']],
  [12, 'Anti-Slip Yoga Mat 6mm', 'Fitness', 'DS', 899, 1399, 4.4, 102, 35, 'best', 'Dense cushioning and a textured surface for stable workouts.', ['6mm']],
].map(([id, name, category, brand, price, mrp, rating, reviews, stock, tag, desc, sizes]) => ({ id, name, category, brand, price, mrp, rating, reviews, stock, tag, desc, sizes, images: imgs(id), image: imgs(id)[0], discount: Math.round(((mrp - price) / mrp) * 100) }))
