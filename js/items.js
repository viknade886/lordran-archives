let allItems = [];
let currentCategory = 'all';

async function loadCategory(cat) {
  currentCategory = cat;

  // Update sidebar active state
  document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
  const items = document.querySelectorAll('.category-item');
  const labels = ['all', 'weapon', 'boss_weapon', 'armor', 'ring', 'covenant', 'consumable'];
  const idx = labels.indexOf(cat);
  if (idx !== -1 && items[idx]) items[idx].classList.add('active');

  // Update title
  const titles = {
    all: 'All Items',
    weapon: 'Weapons',
    boss_weapon: 'Boss Weapons',
    armor: 'Armor',
    ring: 'Rings',
    covenant: 'Covenants',
    consumable: 'Consumables'
  };
  document.getElementById('pageTitle').textContent = titles[cat] || cat;

  const container = document.getElementById('itemsGrid');
  container.innerHTML = '<div class="loading">Kindling the bonfire...</div>';

  try {
    const url = cat === 'all' ? `${API}/items` : `${API}/items/category/${cat}`;
    const res = await fetch(url);
    allItems = await res.json();
    renderItems(allItems);
  } catch (err) {
    container.innerHTML = '<div class="loading">Failed to reach the server.</div>';
  }
}

function filterItems() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allItems.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  );
  renderItems(filtered);
}

function renderItems(items) {
  const container = document.getElementById('itemsGrid');

  if (!items.length) {
    container.innerHTML = '<div class="loading">No entries found in the archives.</div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="item-card">
      ${item.image
        ? `<img src="${item.image}" class="item-image" alt="${item.name}">`
        : `<div class="item-image-placeholder">${getCatIcon(item.category)}</div>`
      }
      <div class="item-body">
        <span class="item-category">${item.category.replace('_', ' ')}</span>
        <h3 class="item-name">${item.name}</h3>
        <p class="item-desc">${item.description}</p>
      </div>
    </div>
  `).join('');
}

function getCatIcon(cat) {
  const icons = {
    weapon: '🗡',
    boss_weapon: '💀',
    armor: '🛡',
    ring: '💍',
    covenant: '🌑',
    consumable: '🧪'
  };
  return icons[cat] || '⚔';
}
