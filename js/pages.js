const Pages = {}
let F = {}, PD = {}, CS = 'standard'
const PER = 12
const perks = [['verified', 'Premium Quality'], ['lock', 'Secure Payments'], ['truck', 'Fast Delivery'], ['replay', 'Easy Returns'], ['comments', 'Expert Support']]
const catTile = (c) => `<a class="cat" href="shop.html?cat=${c}" style="background-image:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.65)),url(https://picsum.photos/seed/cat${c}/500/320)"><span><small>EXPLORE</small>${c}</span><i class="pi pi-arrow-right"></i></a>`
Pages.home = () => {
  $('#app').innerHTML = `<section class="hero"><div class="wrap"><p class="eyebrow">DS SPORTS COLLECTION</p><h1>GEAR UP.<br>PLAY HARD.<br><em>PERFORM BETTER.</em></h1><p class="sub">Premium sports equipment built for players who refuse to settle.</p>
<div class="row"><a class="btn red" href="shop.html">SHOP NOW</a><a class="btn ghost" href="categories.html">EXPLORE COLLECTION</a></div></div></section>
<section class="wrap sec"><h2>Shop by Sport</h2><div class="cats">${['Cricket', 'Badminton', 'Football', 'Basketball', 'Fitness', 'Running'].map(catTile).join('')}</div></section>
<section class="wrap sec"><h2>Featured Products</h2>${grid(products.slice(0, 4))}</section>
<section class="banner"><div class="wrap"><h2>THE CRICKET COLLECTION</h2><p>Built for every innings.</p><a class="btn red" href="shop.html?cat=Cricket">SHOP CRICKET</a></div></section>
<section class="wrap sec"><h2>Best Sellers</h2>${grid(products.filter((p) => p.tag === 'best').slice(0, 4))}</section>
<section class="wrap sec"><h2>New Arrivals</h2>${grid(products.filter((p) => p.tag === 'new').slice(0, 4))}</section>
<section class="wrap sec"><h2>Why DS Sports</h2><div class="perks">${perks.map(([i, t]) => `<div class="perk"><i class="pi pi-${i}"></i><h4>${t}</h4></div>`).join('')}</div></section>
<section class="promo"><div class="wrap"><h2>PLAY.<br>PRACTICE.<br>PERFORM.</h2><p style="margin:16px 0 24px">Everything you need to get better, every day.</p><a class="btn dark" href="shop.html">START SHOPPING</a></div></section>`
}
Pages.categories = () => { $('#app').innerHTML = `<div class="wrap sec"><h2>Categories</h2><div class="cats">${categories.map(catTile).join('')}</div></div>` }
Pages.shop = () => {
  const sp = new URLSearchParams(location.search)
  F = { cat: sp.get('cat') || '', q: (sp.get('q') || '').toLowerCase(), max: 10000, brands: [], disc: 0, stock: false, sort: 'featured', page: 1 }
  const brands = [...new Set(products.map((p) => p.brand))]
  $('#app').innerHTML = `<div class="wrap sec"><h2>${esc(F.q ? 'Results for "' + sp.get('q') + '"' : F.cat || 'All Products')}</h2><div class="shop">
<aside class="filters" id="fl"><h5>Sport / Category</h5><select onchange="setF('cat',this.value)"><option value="">All</option>${categories.map((c) => `<option ${c === F.cat ? 'selected' : ''}>${c}</option>`).join('')}</select>
<h5>Max Price: <span id="mp">${fmt(10000)}</span></h5><input type="range" min="500" max="10000" step="500" value="10000" aria-label="Max price" oninput="setF('max',+this.value);$('#mp').textContent=fmt(this.value)">
<h5>Brand</h5>${brands.map((b) => `<label class="chk"><input type="checkbox" onchange="toggleBrand('${b}',this.checked)"> ${b}</label>`).join('')}
<h5>Discount</h5><select onchange="setF('disc',+this.value)"><option value="0">Any</option><option value="10">10% or more</option><option value="20">20% or more</option><option value="30">30% or more</option></select>
<label class="chk"><input type="checkbox" onchange="setF('stock',this.checked)"> In stock only</label><button class="btn red full close-f" onclick="$('#fl').classList.remove('open')">Show results</button></aside>
<div><div class="bar"><button class="btn ghost-d filter-btn" onclick="$('#fl').classList.add('open')"><i class="pi pi-sliders-h"></i> Filters</button><span id="cnt"></span>
<select aria-label="Sort" onchange="setF('sort',this.value)"><option value="featured">Featured</option><option value="new">Newest</option><option value="low">Price Low to High</option><option value="high">Price High to Low</option><option value="rated">Top Rated</option></select></div><div id="list"></div></div></div></div>`
  runShop()
}
const setF = (k, v) => { F[k] = v; if (k !== 'page') F.page = 1; runShop() }
const toggleBrand = (b, on) => { F.brands = on ? [...F.brands, b] : F.brands.filter((x) => x !== b); F.page = 1; runShop() }
function runShop() {
  const l = products.filter((p) => (!F.cat || p.category === F.cat) && p.price <= F.max && (!F.brands.length || F.brands.includes(p.brand)) && p.discount >= F.disc && (!F.stock || p.stock) && (!F.q || (p.name + p.category + p.brand).toLowerCase().includes(F.q)))
  if (F.sort === 'low') l.sort((a, b) => a.price - b.price)
  if (F.sort === 'high') l.sort((a, b) => b.price - a.price)
  if (F.sort === 'rated') l.sort((a, b) => b.rating - a.rating)
  if (F.sort === 'new') l.reverse()
  const t = Math.max(1, Math.ceil(l.length / PER)); F.page = Math.min(F.page, t)
  const pager = t > 1 ? `<div class="row" style="justify-content:center;margin-top:24px">${Array.from({ length: t }, (_, i) => `<button class="btn ${i + 1 === F.page ? 'dark' : 'ghost-d'}" onclick="setF('page',${i + 1});window.scrollTo(0,0)">${i + 1}</button>`).join('')}</div>` : ''
  $('#cnt').textContent = l.length + ' products'
  $('#list').innerHTML = (l.length ? grid(l.slice((F.page - 1) * PER, F.page * PER)) : '<p class="empty">No products match your filters.</p>') + pager
}
Pages.product = () => {
  const p = find(new URLSearchParams(location.search).get('id'))
  if (!p) return Pages.notfound()
  document.title = p.name + ' | DS Sports Collection'
  const rv = read('ds_rv').filter((x) => x !== p.id); const seen = rv.map(find).filter(Boolean).slice(0, 4); localStorage.ds_rv = JSON.stringify([p.id, ...rv].slice(0, 8))
  PD = { size: p.sizes[0], qty: 1 }
  const rel = products.filter((x) => x.id !== p.id).sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 4)
  $('#app').innerHTML = `<div class="wrap sec"><div class="pd"><div><div class="zoom" onmousemove="const r=this.getBoundingClientRect();this.firstElementChild.style.transformOrigin=((event.clientX-r.left)/r.width*100)+'% '+((event.clientY-r.top)/r.height*100)+'%'"><img id="mi" src="${p.images[0]}" alt="${esc(p.name)}"></div>
<div class="thumbs">${p.images.map((u, i) => `<img src="${u}" alt="View ${i + 1}" class="${i ? '' : 'on'}" onclick="$('#mi').src='${u}';document.querySelectorAll('.thumbs img').forEach(x=>x.classList.remove('on'));this.classList.add('on')">`).join('')}</div></div>
<div><small>${p.category} · ${p.brand}</small><h1 class="pd-t">${esc(p.name)}</h1><div class="stars">${stars(p.rating)} <span>${p.rating} (${p.reviews} reviews)</span></div>
<div class="price big">${fmt(p.price)} <s>${fmt(p.mrp)}</s> <em>${p.discount}% off</em></div><p class="${p.stock ? 'ok' : 'no'}">${p.stock ? (p.stock < 6 ? 'Only ' + p.stock + ' left' : 'In stock') : 'Out of stock'}</p><p>${esc(p.desc)}</p>
<h5>Size</h5><div class="opts">${p.sizes.map((s, i) => `<button class="opt ${i ? '' : 'on'}" onclick="PD.size='${s}';document.querySelectorAll('.opts .opt').forEach(x=>x.classList.remove('on'));this.classList.add('on')">${s}</button>`).join('')}</div>
<h5>Quantity</h5><div class="qty"><button aria-label="Less" onclick="PD.qty=Math.max(1,PD.qty-1);$('#pq').textContent=PD.qty">-</button><span id="pq">1</span><button aria-label="More" onclick="PD.qty=Math.min(${p.stock || 1},PD.qty+1);$('#pq').textContent=PD.qty">+</button></div>
<div class="row"><button class="btn dark" ${p.stock ? '' : 'disabled'} onclick="add(${p.id},PD.size,PD.qty);toast('Added to cart')">ADD TO CART</button><button class="btn red" ${p.stock ? '' : 'disabled'} onclick="add(${p.id},PD.size,PD.qty);location.href='cart.html'">BUY NOW</button>
<button class="btn ghost-d wbtn ${wish.includes(p.id) ? 'on' : ''}" data-w="${p.id}" aria-label="Wishlist" onclick="toggleWish(${p.id})"><i class="pi pi-heart${wish.includes(p.id) ? '-fill' : ''}"></i></button></div>
<h5>Check delivery</h5><div class="row"><input class="inp" id="pin" maxlength="6" inputmode="numeric" placeholder="Pincode" aria-label="Pincode"><button class="btn dark" onclick="$('#pm').textContent=/^\\d{6}$/.test($('#pin').value)?'Delivery available in 3-5 days':'Enter a valid 6-digit pincode'">Check</button></div><p id="pm"></p></div></div>
<div class="tabs"><button class="on" onclick="tab(0,this)">Description</button><button onclick="tab(1,this)">Specifications</button><button onclick="tab(2,this)">Reviews</button></div>
<div class="tp"><p>${esc(p.desc)} Built to handle regular training and match play, with quality checks on every piece.</p></div>
<div class="tp hidden">${[['Brand', p.brand], ['Category', p.category], ['Sizes', p.sizes.join(', ')], ['SKU', 'DS-' + String(p.id).padStart(4, '0')], ['Warranty', '6 months against manufacturing defects']].map(([a, b]) => `<div class="spec"><b>${a}</b><span>${esc(b)}</span></div>`).join('')}</div>
<div class="tp hidden" id="rv"><p class="empty">Loading reviews...</p></div>
<h2 style="margin-top:48px">Related Products</h2>${grid(rel)}${seen.length ? '<h2 style="margin-top:48px">Recently Viewed</h2>' + grid(seen) : ''}</div>`
  loadReviews(p.id)
}
const tab = (i, b) => { document.querySelectorAll('.tabs button').forEach((x) => x.classList.remove('on')); b.classList.add('on'); document.querySelectorAll('.tp').forEach((x, k) => x.classList.toggle('hidden', k !== i)) }
async function loadReviews(pid) {
  let l = []
  try { l = (await db.collection('reviews').where('pid', '==', pid).get()).docs.map((d) => d.data()).sort((a, b) => (b.created?.seconds || 0) - (a.created?.seconds || 0)) } catch (e) { console.error(e) }
  $('#rv').innerHTML = (l.length ? l.map((r) => `<div class="rev">${stars(r.rating)} <b>${esc(r.name)}</b><p>${esc(r.text)}</p></div>`).join('') : '<p class="empty" style="padding:20px 0">No reviews yet. Be the first to review.</p>') +
    (USER ? `<form class="frm" style="margin-top:16px;max-width:520px" onsubmit="addReview(event,${pid})"><h4>Write a review</h4><label>Rating<select id="rr"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></label><label>Your review<textarea id="rt" rows="3" required maxlength="500"></textarea></label><button class="btn dark">SUBMIT REVIEW</button></form>` : '<p class="sm"><a href="login.html?next=' + encodeURIComponent(location.pathname.split('/').pop() + location.search) + '">Login</a> to write a review.</p>')
}
async function addReview(e, pid) {
  e.preventDefault()
  try { await db.collection('reviews').add({ pid, uid: USER.id, name: PROFILE?.name || 'Customer', rating: +$('#rr').value, text: $('#rt').value.trim(), created: TS() }); toast('Review added'); loadReviews(pid) } catch (x) { toast('Could not save review') }
}
Pages.cart = () => {
  const t = totals()
  if (!t.items.length) return ($('#app').innerHTML = '<div class="wrap sec"><p class="empty">Your cart is empty. <a href="shop.html">Start shopping</a></p></div>')
  $('#app').innerHTML = `<div class="wrap sec"><h2>Shopping Cart</h2><div class="cart"><div>${t.items.map((i, k) => `<div class="ci"><img src="${i.p.image}" alt="${esc(i.p.name)}"><div><a href="product.html?id=${i.p.id}"><b>${esc(i.p.name)}</b></a><small>Variant: ${esc(i.v)}</small><div class="price">${fmt(i.p.price * i.qty)}</div>
<div class="qty"><button aria-label="Less" onclick="chg(${k},-1)">-</button><span>${i.qty}</span><button aria-label="More" onclick="chg(${k},1)">+</button></div><div class="row"><button class="link" onclick="rm(${k})">Remove</button><button class="link" onclick="mv(${k})">Move to wishlist</button></div></div></div>`).join('')}</div>
<aside class="sum"><h4>Order Summary</h4><p><span>Subtotal</span><span>${fmt(t.mrp)}</span></p><p><span>Discount</span><span>-${fmt(t.mrp - t.paid + t.extra)}</span></p><p><span>Delivery</span><span>${t.fee ? fmt(t.fee) : 'Free'}</span></p><p class="tot"><span>Total</span><span>${fmt(t.total)}</span></p>
<div class="row"><input class="inp" id="cp" placeholder="Coupon (try DS10)" aria-label="Coupon"><button class="btn dark" onclick="applyCoupon()">Apply</button></div>${coupon() ? '<p class="ok">DS10 applied: 10% off</p>' : ''}<a class="btn red full" href="checkout.html" style="margin-top:14px">PROCEED TO CHECKOUT</a></aside></div></div>`
}
const chg = (k, d) => { const i = totals().items[k]; const c = cart.find((x) => x.id === i.id && x.v === i.v); c.qty = Math.max(1, c.qty + d); persist(); Pages.cart() }
const rm = (k) => { const i = totals().items[k]; cart = cart.filter((x) => !(x.id === i.id && x.v === i.v)); persist(); Pages.cart() }
const mv = (k) => { const i = totals().items[k]; if (!wish.includes(i.id)) wish.push(i.id); cart = cart.filter((x) => !(x.id === i.id && x.v === i.v)); persist(); Pages.cart() }
const applyCoupon = () => { if ($('#cp').value.trim().toUpperCase() === 'DS10') { sessionStorage.ds_coupon = '1'; toast('Coupon applied') } else { sessionStorage.removeItem('ds_coupon'); toast('Invalid coupon') } Pages.cart() }
Pages.wishlist = () => { const l = products.filter((p) => wish.includes(p.id)); $('#app').innerHTML = `<div class="wrap sec"><h2>Wishlist</h2>${l.length ? grid(l) : '<p class="empty">Nothing saved yet. <a href="shop.html">Browse products</a></p>'}</div>` }
const sumHtml = () => { const t = totals(CS); return `<h4>Order Summary</h4>${t.items.map((i) => `<p><span>${esc(i.p.name)} x${i.qty}</span><span>${fmt(i.p.price * i.qty)}</span></p>`).join('')}${t.extra ? `<p><span>Coupon DS10</span><span>-${fmt(t.extra)}</span></p>` : ''}<p><span>Delivery</span><span>${t.fee ? fmt(t.fee) : 'Free'}</span></p><p class="tot"><span>Total</span><span>${fmt(t.total)}</span></p>` }
Pages.checkout = () => {
  if (!needAuth()) return
  if (!cart.length) return ($('#app').innerHTML = '<div class="wrap sec"><p class="empty">Your cart is empty. <a href="shop.html">Start shopping</a></p></div>')
  const u = PROFILE || {}
  $('#app').innerHTML = `<div class="wrap sec"><h2>Checkout</h2><div class="cart"><form class="frm" onsubmit="placeOrder(event)"><h4>Contact Information</h4><div class="two"><label>Full Name<input name="n" required value="${esc(u.name)}"></label><label>Phone<input name="ph" required pattern="[0-9]{10}" inputmode="numeric" title="10 digit number" value="${esc(u.phone)}"></label></div><label>Email<input name="e" type="email" required value="${esc(u.email)}"></label>
<h4>Delivery Address</h4><label>Address<textarea name="a" rows="2" required>${esc(u.addr)}</textarea></label><div class="two"><label>City<input name="c" required value="${esc(u.city)}"></label><label>Pincode<input name="pin" required pattern="[0-9]{6}" inputmode="numeric" title="6 digit pincode" value="${esc(u.pin)}"></label></div>
<h4>Shipping Method</h4><div class="choice"><label><input type="radio" name="s" checked onchange="CS='standard';$('#cs').innerHTML=sumHtml()"> Standard, 3-5 days (free above ₹999)</label><label><input type="radio" name="s" onchange="CS='express';$('#cs').innerHTML=sumHtml()"> Express, 1-2 days (₹149)</label></div>
<h4>Payment</h4><div class="choice"><label><input type="radio" name="pay" value="UPI" checked> UPI</label><label><input type="radio" name="pay" value="Card"> Credit / Debit Card</label><label><input type="radio" name="pay" value="Cash on Delivery"> Cash on Delivery</label></div>
<p class="note">Online payment is not connected yet. Your order is saved as Pending and our team confirms payment with you by phone.</p><button class="btn red full">PLACE ORDER</button></form><aside class="sum" id="cs">${sumHtml()}</aside></div></div>`
}
async function placeOrder(e) {
  e.preventDefault(); const f = new FormData(e.target), t = totals(CS), btn = e.target.querySelector('button.red'); btn.disabled = true; btn.textContent = 'PLACING ORDER...'
  const id = 'DS' + Date.now().toString().slice(-8)
  try {
    await db.collection('users').doc(USER.id).collection('orders').doc(id).set({ status: 'Pending', name: f.get('n'), phone: f.get('ph'), email: f.get('e'), address: f.get('a'), city: f.get('c'), pincode: f.get('pin'), shipping: CS, payment: f.get('pay'), coupon: coupon() ? 'DS10' : '', total: t.total, fee: t.fee, items: t.items.map((i) => ({ id: i.id, n: i.p.name, v: i.v, q: i.qty, price: i.p.price })), created: TS() })
    cart = []; sessionStorage.removeItem('ds_coupon'); persist(); toast('Order placed: ' + id); setTimeout(() => (location.href = 'orders.html'), 900)
  } catch (x) { console.error(x); btn.disabled = false; btn.textContent = 'PLACE ORDER'; toast('Could not place order. Check Firestore rules.') }
}
const side = (on) => `<aside class="side">${[['profile', 'Profile'], ['orders', 'Orders'], ['wishlist', 'Wishlist']].map(([h, l]) => `<a href="${h}.html" class="${on === h ? 'on' : ''}">${l}</a>`).join('')}<a href="#" onclick="logout();return false">Logout</a></aside>`
Pages.orders = async () => {
  if (!needAuth()) return
  $('#app').innerHTML = `<div class="wrap sec"><h2>My Orders</h2><div class="dash">${side('orders')}<div id="ol"><p class="empty">Loading orders...</p></div></div></div>`
  try {
    const s = await db.collection('users').doc(USER.id).collection('orders').orderBy('created', 'desc').get()
    $('#ol').innerHTML = s.empty ? '<p class="empty">No orders yet. <a href="shop.html">Shop now</a></p>' : s.docs.map((d) => { const o = d.data(); return `<div class="box"><h4><span>Order #${d.id}</span><span class="st">${esc(o.status)}</span></h4><p style="color:#777;font-size:.85rem">${o.created ? o.created.toDate().toLocaleDateString('en-IN') : ''} · ${esc(o.payment)} · ${esc(o.city)}</p>${o.items.map((i) => `<p>${esc(i.n)} (${esc(i.v)}) x${i.q}</p>`).join('')}<p><b>${fmt(o.total)}</b></p></div>` }).join('')
  } catch (x) { console.error(x); $('#ol').innerHTML = '<p class="empty">Could not load orders. Check Firestore rules.</p>' }
}
Pages.profile = () => {
  if (!needAuth()) return
  const u = PROFILE || {}
  $('#app').innerHTML = `<div class="wrap sec"><h2>My Account</h2><div class="dash">${side('profile')}<div><div class="box"><h4>${esc(u.name) || 'Your account'}</h4><p>${esc(USER.email)}</p><p>${esc(u.phone)}</p></div>
<div class="box"><h4>Account Settings & Default Address</h4><form class="frm" onsubmit="saveProfile(event)" style="margin-top:12px"><label>Full Name<input id="pn" value="${esc(u.name)}" required></label><label>Phone<input id="pph" value="${esc(u.phone)}" pattern="[0-9]{10}" required></label>
<label>Address<textarea id="pa" rows="2">${esc(u.addr)}</textarea></label><div class="two"><label>City<input id="pc" value="${esc(u.city)}"></label><label>Pincode<input id="pp" value="${esc(u.pin)}" pattern="[0-9]{6}"></label></div><button class="btn dark">SAVE CHANGES</button></form></div></div></div></div>`
}
async function saveProfile(e) {
  e.preventDefault(); const d = { name: $('#pn').value.trim(), phone: $('#pph').value.trim(), addr: $('#pa').value.trim(), city: $('#pc').value.trim(), pin: $('#pp').value.trim() }
  try { await db.doc('users/' + USER.id).set(d, { merge: true }); PROFILE = { ...PROFILE, ...d }; toast('Profile updated'); Pages.profile() } catch (x) { toast('Could not save profile') }
}
const authShell = (title, form, foot) => `<div class="auth"><div class="auth-l"><h1>PLAY.<br>PRACTICE.<br><em>PERFORM.</em></h1><p style="margin-top:14px;opacity:.8">Your DS Sports account. Track orders and save your favourite gear.</p></div><div class="auth-r"><h2>${title}</h2>${form}<p class="sm">${foot}</p></div></div>`
const nextUrl = () => { const n = new URLSearchParams(location.search).get('next'); return n && /^[\w.\-]+(\?[\w=&%.\-]*)?$/.test(n) ? n : 'profile.html' }
Pages.login = () => {
  if (USER) return (location.href = nextUrl())
  $('#app').innerHTML = authShell('Login', `<form class="frm" onsubmit="doLogin(event)"><label>Email<input id="le" type="email" required autocomplete="email"></label><label>Password<input id="lp" type="password" required minlength="6" autocomplete="current-password"></label>
<div class="row" style="justify-content:space-between;margin:0"><label style="display:flex;flex-direction:row;gap:6px;text-transform:none"><input type="checkbox" id="lr" checked> Remember me</label><a href="#" class="link-a" onclick="forgot();return false">Forgot Password?</a></div>
<button class="btn red full">LOGIN</button><button type="button" class="btn ghost-d full" onclick="googleLogin()"><i class="pi pi-google"></i> CONTINUE WITH GOOGLE</button></form>`, 'New here? <a href="signup.html">Create account</a>')
}
Pages.signup = () => {
  if (USER) return (location.href = 'profile.html')
  $('#app').innerHTML = authShell('Create Account', `<form class="frm" onsubmit="doSignup(event)"><label>Full Name<input id="sn" required autocomplete="name"></label><label>Email<input id="se" type="email" required autocomplete="email"></label><label>Phone Number<input id="sph" required pattern="[0-9]{10}" inputmode="numeric" title="10 digit number" autocomplete="tel"></label>
<label>Password<input id="sp" type="password" required minlength="6" autocomplete="new-password"></label><label>Confirm Password<input id="sc" type="password" required minlength="6" autocomplete="new-password"></label><button class="btn red full">CREATE ACCOUNT</button></form>`, 'Already registered? <a href="login.html">Login</a>')
}
async function doSignup(e) {
  e.preventDefault()
  if ($('#sp').value !== $('#sc').value) return toast('Passwords do not match')
  const name = $('#sn').value.trim(); localStorage.ds_pending = JSON.stringify({ name, phone: $('#sph').value.trim() })
  try { const c = await auth.createUserWithEmailAndPassword($('#se').value.trim(), $('#sp').value); await c.user.updateProfile({ displayName: name }); toast('Account created'); setTimeout(() => (location.href = 'profile.html'), 700) } catch (x) { toast(fbErr(x)) }
}
async function doLogin(e) {
  e.preventDefault()
  try { await auth.setPersistence($('#lr').checked ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION); await auth.signInWithEmailAndPassword($('#le').value.trim(), $('#lp').value); toast('Logged in'); setTimeout(() => (location.href = nextUrl()), 600) } catch (x) { toast(fbErr(x)) }
}
async function googleLogin() { try { await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); location.href = nextUrl() } catch (x) { toast(fbErr(x)) } }
async function forgot() { const em = $('#le').value.trim(); if (!em) return toast('Type your email first, then tap Forgot Password'); try { await auth.sendPasswordResetEmail(em); toast('Password reset link sent to your email') } catch (x) { toast(fbErr(x)) } }
Pages.about = () => { $('#app').innerHTML = `<div class="wrap sec abt"><h2>About DS Sports Collection</h2><p>DS Sports Collection brings premium sports gear to players at every level. From cricket bats and badminton rackets to footballs and training equipment, every product is chosen for quality, durability and performance.</p><p>Our promise is simple: <b>Play. Practice. Perform.</b> Genuine products, honest prices, fast delivery and easy returns.</p><a class="btn red" href="shop.html">SHOP THE COLLECTION</a></div>` }
Pages.contact = () => { $('#app').innerHTML = `<div class="wrap sec abt"><h2>Contact Us</h2><form class="frm" onsubmit="sendMsg(event)"><label>Name<input id="cn" required></label><label>Email<input id="ce" type="email" required></label><label>Message<textarea id="cm" rows="5" required maxlength="1000"></textarea></label><button class="btn red">SEND MESSAGE</button></form></div>` }
async function sendMsg(e) { e.preventDefault(); try { await db.collection('messages').add({ name: $('#cn').value.trim(), email: $('#ce').value.trim(), message: $('#cm').value.trim(), created: TS() }); toast('Message sent. We will reply soon.'); e.target.reset() } catch (x) { toast('Could not send message') } }
Pages.notfound = () => { $('#app').innerHTML = '<div class="wrap sec nf"><h1>404</h1><p>This page is out of play.</p><a class="btn red" href="index.html">BACK HOME</a></div>' }
;(async () => { layout(); await ready; const f = Pages[document.body.dataset.page] || Pages.notfound; f() })()
