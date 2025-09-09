
function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function formatWon(value) { return value.toLocaleString('ko-KR'); }

function renderStars(n = 4) {
  return '<span aria-label="평점" title="평점">' + '★'.repeat(n) + '☆'.repeat(5-n) + '</span>';
}

function updateCartCount() {
  const countEl = qs('#cart-count');
  if (countEl && window.Cart) {
    countEl.textContent = String(window.Cart.count());
  }
}

window.addEventListener('cart:changed', updateCartCount);
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  const page = document.body.getAttribute('data-page');
  if (page === 'home') initHome();
  if (page === 'products') initProducts();
  if (page === 'product') initProductDetail();
  if (page === 'cart') initCartPage();
  if (page === 'checkout') initCheckoutPage();
});


// HOME
function initHome() {
  const featuredWrap = qs('#featured-grid');
  const catWrap = qs('#category-grid');
  if (!featuredWrap || !catWrap) return;

  const featured = window.PRODUCTS.slice(0, 8);
  featuredWrap.innerHTML = featured.map(productCard).join('');
  attachAddToCartButtons(featuredWrap);

  const cats = Array.from(new Set(window.PRODUCTS.map(p => p.category)));
  catWrap.innerHTML = cats.map(cat => {
    // 카테고리별 아이콘 매핑
    const iconMap = {
      '의류': 'fa-solid fa-shirt',
      '액세서리': 'fa-solid fa-gem',
      '신발': 'fa-solid fa-shoe-prints',
      '가방': 'fa-solid fa-briefcase'
    };
    
    const icon = iconMap[cat] || 'fa-solid fa-tag'; // 기본 아이콘
    
    return `
      <a class="category-card" href="products.html?category=${encodeURIComponent(cat)}" aria-label="${cat} 카테고리 보기">
        <div class="category-icon">
          <i class="${icon}" aria-hidden="true"></i>
        </div>
        <div class="category-name">${cat}</div>
      </a>
    `;
  }).join('');
  
}
var mySwiper = new Swiper(".hero-swiper", {
  loop: true,
        // autoplay: {
        //   delay: 5000,
        //   disableOnInteraction: false,
        // },
        speed: 800,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        
        // 네비게이션
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        
        // 페이지네이션
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        
        // 반응형 설정
        // breakpoints: {
        //   768: {
        //     effect: 'slide',
        //     fadeEffect: {
        //       crossFade: false
        //     }
        //   }
        // }
})

// PRODUCTS LIST
function initProducts() {
  const grid = qs('#products-grid');
  const select = qs('#category-select');
  const search = qs('#search-input');
  const params = new URLSearchParams(location.search);
  const initialCat = params.get('category') || '전체';

  const categories = ['전체', ...Array.from(new Set(window.PRODUCTS.map(p => p.category)))];
  select.innerHTML = categories.map(c => `<option ${c===initialCat?'selected':''} value="${c}">${c}</option>`).join('');

  function applyFilters() {
    const keyword = search.value.trim().toLowerCase();
    const cat = select.value;
    const filtered = window.PRODUCTS.filter(p => {
      const byCat = cat === '전체' ? true : p.category === cat;
      const byKey = !keyword || p.title.toLowerCase().includes(keyword);
      return byCat && byKey;
    });
    grid.innerHTML = filtered.map(productCard).join('');
    attachAddToCartButtons(grid);
  }

  select.addEventListener('change', applyFilters);
  search.addEventListener('input', applyFilters);
  applyFilters();
}

// PRODUCT DETAIL
function initProductDetail() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || window.PRODUCTS[0]?.id;
  const product = window.PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const img = qs('#detail-image');
  const title = qs('#detail-title');
  const price = qs('#detail-price');
  const desc = qs('#detail-desc');
  const qty = qs('#detail-qty');
  const addBtn = qs('#detail-add');

  img.src = product.imageUrl;
  img.alt = product.title;
  title.textContent = product.title;
  price.innerHTML = `${formatWon(product.price)} <span class="won">원</span>`;
  desc.textContent = product.description;

  addBtn.addEventListener('click', () => {
    const n = parseInt(qty.value || '1', 10) || 1;
    window.Cart.add(product.id, Math.max(1, n));
    announce(`${product.title} ${n}개 장바구니에 담았습니다.`);
    alert('상품을 장바구니에 담았습니다');
  });
}

// CART PAGE
function initCartPage() {
  const list = qs('#cart-list');
  const totalEl = qs('#cart-total');
  const empty = qs('#cart-empty');
  const toCheckout = qs('#to-checkout');

  function render() {
    const items = window.Cart.getAll();
    const prods = window.PRODUCTS;
    if (!items.length) {
      empty.hidden = false; list.innerHTML = ''; totalEl.textContent = '0';
      toCheckout.setAttribute('disabled', 'true');
      return;
    }
    empty.hidden = true; toCheckout.removeAttribute('disabled');
    list.innerHTML = items.map(i => {
      const p = prods.find(p => p.id === i.id);
      if (!p) return '';
      return `
        <div class="cart-item" data-id="${i.id}">
          <img src="${p.imageUrl}" alt="${p.title}" width="88" height="88" />
          <div>
            <div class="title">${p.title}</div>
            <div class="meta">단가 ${formatWon(p.price)}원</div>
            <div class="product-actions">
              <button class="btn" data-action="dec" aria-label="수량 감소">-</button>
              <input class="qty" type="number" min="1" value="${i.quantity}" aria-label="수량" />
              <button class="btn" data-action="inc" aria-label="수량 증가">+</button>
              <button class="btn" data-action="remove" aria-label="상품 제거">삭제</button>
            </div>
          </div>
          <div class="price" aria-label="상품 합계">${formatWon(p.price * i.quantity)} <span class="won">원</span></div>
        </div>
      `;
    }).join('');
    totalEl.textContent = formatWon(window.Cart.total());
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const itemEl = e.target.closest('.cart-item');
    if (!itemEl) return;
    const id = itemEl.getAttribute('data-id');
    const qtyInput = itemEl.querySelector('.qty');
    const current = parseInt(qtyInput.value || '1', 10) || 1;
    const action = btn.getAttribute('data-action');
    if (action === 'inc') window.Cart.update(id, current + 1);
    if (action === 'dec') window.Cart.update(id, Math.max(1, current - 1));
    if (action === 'remove') window.Cart.remove(id);
    render(); updateCartCount();
  });

  list.addEventListener('change', (e) => {
    const input = e.target.closest('.qty');
    if (!input) return;
    const itemEl = e.target.closest('.cart-item');
    const id = itemEl.getAttribute('data-id');
    const n = Math.max(1, parseInt(input.value || '1', 10) || 1);
    window.Cart.update(id, n); render(); updateCartCount();
  });

  render();
}

// CHECKOUT PAGE
function initCheckoutPage() {
  const summary = qs('#order-summary');
  const totalEl = qs('#checkout-total');
  const form = qs('#payment-form');

  function renderSummary() {
    const items = window.Cart.getAll();
    const prods = window.PRODUCTS;
    if (!items.length) {
      summary.innerHTML = '<div class="muted">장바구니가 비어 있습니다.</div>';
      totalEl.textContent = '0';
      return;
    }
    summary.innerHTML = items.map(i => {
      const p = prods.find(p => p.id === i.id);
      if (!p) return '';
      return `<div class="summary-row"><span>${p.title} × ${i.quantity}</span><strong>${formatWon(p.price * i.quantity)}원</strong></div>`;
    }).join('');
    totalEl.textContent = formatWon(window.Cart.total());
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!window.Cart.getAll().length) {
      alert('장바구니가 비어 있습니다.');
      return;
    }
    // 간단한 클라이언트 확인
    const required = qsa('[data-required="true"]', form);
    const invalid = required.find(i => !i.value.trim());
    if (invalid) {
      alert('필수 입력값을 확인해주세요.');
      invalid.focus();
      return;
    }
    window.Cart.clear();
    updateCartCount();
    alert('주문이 완료되었습니다. 감사합니다!');
    location.href = 'index.html';
  });

  renderSummary();
}

// Components
function productCard(p) {
  return `
    <article class="card" aria-label="${p.title}">
      <a href="product.html?id=${encodeURIComponent(p.id)}" aria-label="상품 상세 보기">
        <div class="card-media"><img src="${p.imageUrl}" alt="${p.title}"></div>
      </a>
      <div class="card-body">
        <div class="title">${p.title}</div>
        <div class="muted">${renderStars(4)} · ${p.category}</div>
        <div class="card-actions">
          <div class="price">${formatWon(p.price)} <span class="won">원</span></div>
          <button class="btn btn-primary" data-add="${p.id}" aria-label="장바구니에 담기">담기</button>
        </div>
      </div>
    </article>
  `;
}

function attachAddToCartButtons(root) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const id = btn.getAttribute('data-add');
    window.Cart.add(id, 1);
    const p = window.PRODUCTS.find(p => p.id === id);
    announce(`${p?.title || '상품'} 1개 장바구니에 담았습니다.`);
    alert('상품을 장바구니에 담았습니다');
  });
}

function announce(text) {
  let region = qs('#live-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'live-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.className = 'visually-hidden';
    document.body.appendChild(region);
  }
  region.textContent = text;
}


