(function(){
  const STORAGE_KEY = "portfolio_cart_v1";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    dispatchChange();
  }

  function dispatchChange() {
    window.dispatchEvent(new CustomEvent("cart:changed"));
  }

  function findIndex(cart, id) {
    return cart.findIndex(i => i.id === id);
  }

  const Cart = {
    getAll() { return load(); },
    clear() { save([]); },
    add(id, quantity = 1) {
      const cart = load();
      const idx = findIndex(cart, id);
      if (idx >= 0) {
        cart[idx].quantity += quantity;
      } else {
        cart.push({ id, quantity });
      }
      save(cart);
    },
    remove(id) {
      const cart = load().filter(i => i.id !== id);
      save(cart);
    },
    update(id, quantity) {
      const cart = load();
      const idx = findIndex(cart, id);
      if (idx >= 0) {
        if (quantity <= 0) cart.splice(idx, 1);
        else cart[idx].quantity = quantity;
        save(cart);
      }
    },
    count() {
      return load().reduce((sum, i) => sum + i.quantity, 0);
    },
    total() {
      return load().reduce((sum, i) => {
        const p = (window.PRODUCTS || []).find(p => p.id === i.id);
        return sum + (p ? p.price * i.quantity : 0);
      }, 0);
    }
  };

  window.Cart = Cart;
})();


