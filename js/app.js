firebase.initializeApp({ apiKey: 'AIzaSyCcHhVwrSiaOTwX2PfvqW4EpJUKyFyPDEg', authDomain: 'ds-sports-c7ab8.firebaseapp.com', projectId: 'ds-sports-c7ab8', storageBucket: 'ds-sports-c7ab8.firebasestorage.app', messagingSenderId: '959041805195', appId: '1:959041805195:web:421c0a6da4b99b02676d8e' })
const auth = firebase.auth(), db = firebase.firestore(), TS = () => firebase.firestore.FieldValue.serverTimestamp()
const $ = (s) => document.querySelector(s)
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const find = (id) => products.find((p) => p.id === +id)
const read = (k) => { try { return JSON.parse(localStorage[k] || '[]') } catch { return [] } }
let cart = read('ds_cart'), wish = read('ds_wish'), USER = null, PROFILE = null, saveT
const stars = (r) => '<span class="stars">' + [1, 2, 3, 4, 5].map((i) => `<i class="pi pi-star${i <= Math.round(r) ? '-fill' : ''}"></i>`).join('') + '</span>'
function toast(m) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2800) }
function badges() {
  const n = cart.reduce((s, i) => s + i.qty, 0)
  ;[['#cc', n], ['#wc', wish.length]].forEach(([s, v]) => { const e = $(s); if (e) { e.textContent = v; e.classList.toggle('hidden', !v) } })
}
function persist() {
  localStorage.ds_cart = JSON.stringify(cart); localStorage.ds_wish = JSON.stringify(wish); badges()
  if (USER) { clearTimeout(saveT); saveT = setTimeout(() => db.doc('users/' + USER.id).set({ cart, wish }, { merge: true }).catch(console.error), 500) }
}
function add(id, v, q = 1) { const f = cart.find((i) => i.id === id && i.v === v); f ? (f.qty += q) : cart.push({ id, v, qty: q }); persist() }
function toggleWish(id) {
  wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id]; persist()
  const on = wish.includes(id)
  document.querySelectorAll(`[data-w="${id}"]`).forEach((el) => { el.classList.toggle('on', on); el.querySelector('i').className = 'pi pi-heart' + (on ? '-fill' : '') })
  toast(on ? 'Added to wishlist' : 'Removed from wishlist')
  if (document.body.dataset.page === 'wishlist') Pages.wishlist()
}
const NAV = [['Home', 'index.html'], ['Shop', 'shop.html'], ['Cricket', 'shop.html?cat=Cricket'], ['Badminton', 'shop.html?cat=Badminton'], ['Football', 'shop.html?cat=Football'], ['Fitness', 'shop.html?cat=Fitness'], ['Accessories', 'shop.html?cat=Accessories']]
function layout() {
  const cur = (location.pathname.split('/').pop() || 'index.html') + location.search
  const links = NAV.map(([l, h]) => `<a href="${h}" class="${cur === h ? 'active' : ''}">${l}</a>`).join('')
  $('#hdr').className = 'nav'
  $('#hdr').innerHTML = `<div class="nav-in"><button class="icon-btn menu-btn" aria-label="Menu" onclick="$('#mm').classList.toggle('hidden')"><i class="pi pi-bars"></i></button>
<a href="index.html" class="logo"><img src="assets/logo.jpeg" alt="DS Sports Collection"></a><nav class="nav-links">${links}</nav>
<div class="nav-actions"><button class="icon-btn" aria-label="Search" onclick="$('#sb').classList.toggle('show');$('#q').focus()"><i class="pi pi-search"></i></button>
<a class="icon-btn hide-m" href="wishlist.html" aria-label="Wishlist"><i class="pi pi-heart"></i><b class="badge hidden" id="wc"></b></a>
<a class="icon-btn" href="profile.html" aria-label="Account"><i class="pi pi-user"></i></a>
<a class="icon-btn" href="cart.html" aria-label="Cart"><i class="pi pi-shopping-bag"></i><b class="badge hidden" id="cc"></b></a></div></div>
<form class="searchbar" id="sb" onsubmit="event.preventDefault();const v=$('#q').value.trim();if(v)location.href='shop.html?q='+encodeURIComponent(v)"><input id="q" placeholder="Search bats, rackets, balls..." aria-label="Search"><button class="btn red">Search</button></form>
<div class="mobile-menu hidden" id="mm">${links}</div>`
  $('#ftr').innerHTML = `<section class="newsletter"><div class="wrap"><h2>Join the Team</h2><p>Get offers and new arrivals first.</p><form class="row" onsubmit="subscribe(event)"><input class="inp" type="email" required placeholder="Your email" aria-label="Email"><button class="btn red">SUBSCRIBE</button></form></div></section>
<footer class="footer"><div class="wrap foot-grid"><div><img class="flogo" src="assets/logo.jpeg" alt="DS Sports"><p>Play. Practice. Perform.</p></div>
<div><h5>Shop</h5><a href="shop.html">All Products</a><a href="categories.html">Categories</a><a href="shop.html?cat=Cricket">Cricket</a><a href="shop.html?cat=Badminton">Badminton</a></div>
<div><h5>Customer Service</h5><a href="profile.html">My Account</a><a href="orders.html">Orders</a><a href="cart.html">Cart</a><a href="wishlist.html">Wishlist</a></div>
<div><h5>Information</h5><a href="about.html">About Us</a><a href="contact.html">Contact</a><a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a><a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a><a href="https://wa.me/" target="_blank" rel="noopener">WhatsApp</a></div></div><p class="copy">© 2026 DS Sports Collection</p></footer>
<nav class="bottom-nav"><a href="index.html"><i class="pi pi-home"></i><span>Home</span></a><a href="categories.html"><i class="pi pi-th-large"></i><span>Categories</span></a><a href="#" onclick="$('#sb').classList.add('show');$('#q').focus();window.scrollTo(0,0);return false"><i class="pi pi-search"></i><span>Search</span></a><a href="wishlist.html"><i class="pi pi-heart"></i><span>Wishlist</span></a><a href="profile.html"><i class="pi pi-user"></i><span>Account</span></a></nav>`
  badges()
}
async function subscribe(e) { e.preventDefault(); const em = e.target.querySelector('input').value.trim(); try { await db.collection('subscribers').add({ email: em, created: TS() }); toast('Subscribed. Welcome to DS Sports.'); e.target.reset() } catch (x) { toast('Could not subscribe right now') } }
async function loadUser() {
  try {
    const ref = db.doc('users/' + USER.id); let snap = await ref.get()
    if (!snap.exists) {
      const p = JSON.parse(localStorage.ds_pending || '{}')
      await ref.set({ name: p.name || USER.fb.displayName || '', phone: p.phone || '', email: USER.email || '', cart: [], wish: [], created: TS() }); snap = await ref.get(); localStorage.removeItem('ds_pending')
    }
    PROFILE = snap.data()
    const m = (PROFILE.cart || []).map((x) => ({ ...x }))
    cart.forEach((l) => { const f = m.find((x) => x.id === l.id && x.v === l.v); f ? (f.qty = Math.max(f.qty, l.qty)) : m.push({ ...l }) })
    cart = m.filter((i) => find(i.id)); wish = [...new Set([...(PROFILE.wish || []), ...wish])].filter(find); persist()
  } catch (e) { console.error(e); PROFILE = { name: USER.fb.displayName || '', phone: '', email: USER.email || '' }; toast('Database not ready. Publish the Firestore rules.') }
}
const ready = new Promise((res) => auth.onAuthStateChanged(async (u) => { USER = u ? { id: u.uid, email: u.email, fb: u } : null; if (u) await loadUser(); res() }))
function needAuth() { if (USER) return true; location.replace('login.html?next=' + encodeURIComponent((location.pathname.split('/').pop() || 'index.html') + location.search)); return false }
async function logout() { await auth.signOut(); cart = []; wish = []; localStorage.removeItem('ds_cart'); localStorage.removeItem('ds_wish'); location.href = 'login.html' }
const fbErr = (e) => ({ 'auth/email-already-in-use': 'Email already registered', 'auth/invalid-credential': 'Wrong email or password', 'auth/invalid-email': 'Enter a valid email', 'auth/weak-password': 'Password must be at least 6 characters', 'auth/user-not-found': 'No account with this email', 'auth/popup-closed-by-user': 'Google login cancelled', 'auth/too-many-requests': 'Too many tries. Wait a bit and retry', 'auth/unauthorized-domain': 'Add this website domain in Firebase > Authentication > Settings > Authorized domains' }[e.code] || e.message)
const coupon = () => sessionStorage.ds_coupon === '1'
function totals(ship = 'standard') {
  const items = cart.map((i) => ({ ...i, p: find(i.id) })).filter((i) => i.p)
  const mrp = items.reduce((s, i) => s + i.p.mrp * i.qty, 0), paid = items.reduce((s, i) => s + i.p.price * i.qty, 0)
  const extra = coupon() ? Math.round(paid * 0.1) : 0, fee = !paid ? 0 : ship === 'express' ? 149 : paid > 999 ? 0 : 79
  return { items, mrp, paid, extra, fee, total: paid - extra + fee }
}
const card = (p) => `<article class="card"><div class="card-img"><a href="product.html?id=${p.id}"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy"></a><span class="disc">-${p.discount}%</span>
<button class="heart ${wish.includes(p.id) ? 'on' : ''}" data-w="${p.id}" aria-label="Wishlist" onclick="toggleWish(${p.id})"><i class="pi pi-heart${wish.includes(p.id) ? '-fill' : ''}"></i></button><button class="qv" onclick="quick(${p.id})">Quick view</button></div>
<div class="card-body"><small>${p.category}</small><a href="product.html?id=${p.id}"><h3>${esc(p.name)}</h3></a><div class="stars">${stars(p.rating)} <span>(${p.reviews})</span></div>
<div class="price">${fmt(p.price)} <s>${fmt(p.mrp)}</s></div><button class="btn dark full" ${p.stock ? '' : 'disabled'} onclick="add(${p.id},'${p.sizes[0]}');toast('Added to cart')">${p.stock ? 'Add to Cart' : 'Out of Stock'}</button></div></article>`
const grid = (l) => (l.length ? `<div class="grid">${l.map(card).join('')}</div>` : '<p class="empty">Nothing here yet.</p>')
function quick(id) {
  const p = find(id), m = document.createElement('div'); m.className = 'modal'; m.onclick = (e) => e.target === m && m.remove()
  m.innerHTML = `<div class="modal-box"><button class="x" aria-label="Close" onclick="this.closest('.modal').remove()">×</button><div class="pd"><div class="zoom"><img src="${p.image}" alt="${esc(p.name)}"></div><div><small>${p.category} · ${p.brand}</small><h3 style="font-size:1.5rem;margin:6px 0">${esc(p.name)}</h3><div class="stars">${stars(p.rating)} <span>(${p.reviews})</span></div><div class="price big">${fmt(p.price)} <s>${fmt(p.mrp)}</s></div><p>${esc(p.desc)}</p>
<div class="row"><button class="btn dark" ${p.stock ? '' : 'disabled'} onclick="add(${p.id},'${p.sizes[0]}');toast('Added to cart');this.closest('.modal').remove()">ADD TO CART</button><a class="btn red" href="product.html?id=${p.id}">VIEW DETAILS</a></div></div></div></div>`
  document.body.appendChild(m)
}
