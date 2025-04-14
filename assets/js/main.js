
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brown: {
          light: '#8B6B4D',
          DEFAULT: '#361f10',
          dark: '#1a110b'
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        noto: ['Noto Serif', 'serif']
      }
    }
  }
}

// cart functionality
let cart = [];

function addToCart(itemName, price) {
  // pang check ng item sa cart
  const existingItem = cart.find(item => item.name === itemName);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: itemName,
      price: price,
      quantity: 1
    });
  }
  
  updateCartDisplay();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

function updateQuantity(index, newQuantity) {
  if (newQuantity > 0) {
    cart[index].quantity = newQuantity;
  } else {
    removeFromCart(index);
  }
  updateCartDisplay();
}

function clearCart() {
  cart = [];
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartContainer = document.getElementById('cart-items');
  const subtotalElement = document.getElementById('subtotal');
  const totalElement = document.getElementById('total');
  
  // clear current cart display
  cartContainer.innerHTML = '';
  
  // add each item to the cart display
  cart.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'flex justify-between items-center p-4 bg-brown/5 rounded-lg';
    itemElement.innerHTML = `
      <div>
        <h4 class="font-semibold text-brown">${item.name}</h4>
        <p class="text-sm text-brown-light">₱${item.price} × ${item.quantity}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="font-bold text-brown">₱${item.price * item.quantity}</span>
        <div class="flex items-center gap-2">
          <button onclick="updateQuantity(${index}, ${item.quantity - 1})" class="w-6 h-6 flex items-center justify-center bg-brown/10 text-brown rounded hover:bg-brown/20">-</button>
          <span class="w-8 text-center">${item.quantity}</span>
          <button onclick="updateQuantity(${index}, ${item.quantity + 1})" class="w-6 h-6 flex items-center justify-center bg-brown/10 text-brown rounded hover:bg-brown/20">+</button>
        </div>
        <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    cartContainer.appendChild(itemElement);
  });
  
  // calculate and display total
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  subtotalElement.textContent = `₱${subtotal.toFixed(2)}`;
  totalElement.textContent = `₱${subtotal.toFixed(2)}`;
}

// mouse scroll pataas
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// event listeners
document.addEventListener('DOMContentLoaded', function() {
  // smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // laman ng cart
  const clearCartButton = document.getElementById('clear-cart');
  const checkoutButton = document.getElementById('checkout');

  if (clearCartButton) {
    clearCartButton.addEventListener('click', clearCart);
  }

  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Please add items to your cart before checking out.');
        return;
      }
      
      // calculate the total
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // generate receipt
      const receipt = document.getElementById('receipt');
      const receiptItems = document.getElementById('receipt-items');
      const receiptSubtotal = document.getElementById('receipt-subtotal');
      const receiptTotal = document.getElementById('receipt-total');
      const receiptDateTime = document.getElementById('receipt-datetime');
      
      
      receiptItems.innerHTML = '';
      
      // add current date and time
      const now = new Date();
      receiptDateTime.textContent = now.toLocaleString();
      
      // add items to receipt
      cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between text-sm';
        itemElement.innerHTML = `
          <div>
            <span class="text-brown">${item.name}</span>
            <span class="text-brown-light ml-2">×${item.quantity}</span>
          </div>
          <span class="text-brown">₱${(item.price * item.quantity).toFixed(2)}</span>
        `;
        receiptItems.appendChild(itemElement);
      });
      
     
      receiptSubtotal.textContent = `₱${total.toFixed(2)}`;
      receiptTotal.textContent = `₱${total.toFixed(2)}`;
      
     
      receipt.classList.remove('hidden');
      
      
      receipt.scrollIntoView({ behavior: 'smooth' });
      
      
      clearCart();
    });
  }
});
