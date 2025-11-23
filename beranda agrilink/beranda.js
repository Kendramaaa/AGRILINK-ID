// --- 1. DATA STATE ---
// Simulasi database produk
let products = [
    {
        id: 1,
        title: "Beras Cianjur Premium",
        category: "grains",
        price: 14000,
        stock: 500,
        desc: "Dipanen segar dari sawah Cianjur. Organik dan pulen.",
        img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        title: "Jagung Manis Segar",
        category: "vegetables",
        price: 8000,
        stock: 200,
        desc: "Jagung manis langsung dari batang. Cocok untuk dibakar.",
        img: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        title: "Cabai Merah Keriting",
        category: "vegetables",
        price: 45000,
        stock: 50,
        desc: "Cabai merah super pedas. Bebas pestisida.",
        img: "https://jangkausayur.com/cdn/shop/products/cmk_540x.jpg?v=1680442354"
    },
    {
        id: 4,
        title: "Pisang Lokal",
        category: "fruits",
        price: 12000,
        stock: 150,
        desc: "Pisang kuning manis, tingkat kematangan pas.",
        img: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80"
    }
];

// --- 2. DOM ELEMENTS ---
const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.category-filters button');
const uploadModal = document.getElementById('uploadModal');
const detailModal = document.getElementById('detailModal');
const uploadForm = document.getElementById('uploadForm');

// --- 3. RENDER FUNCTIONS ---
function renderProducts(data) {
    grid.innerHTML = '';
    if(data.length === 0) {
        grid.innerHTML = '<p style="color:white; grid-column: 1/-1; text-align:center;">Produk tidak ditemukan.</p>';
        return;
    }

    data.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openDetailModal(product);
        
        // Format Rupiah
        const formattedPrice = product.price.toLocaleString('id-ID');

        card.innerHTML = `
            <img src="${product.img}" alt="${product.title}" class="card-img">
            <div class="card-body">
                <span class="category-tag">${product.category}</span>
                <h3 class="card-title">${product.title}</h3>
                <div class="card-price">Rp ${formattedPrice} <span style="font-size:0.8rem; color:#666; font-weight:400">/kg</span></div>
                <div class="card-stock">Stok: ${product.stock} kg</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- 4. FILTER & SEARCH LOGIC ---
let activeCategory = 'all';

function filterData() {
    const query = searchInput.value.toLowerCase();
    
    const filtered = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(query);
        const matchesCat = activeCategory === 'all' || p.category === activeCategory;
        return matchesSearch && matchesCat;
    });
    renderProducts(filtered);
}

searchInput.addEventListener('input', filterData);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Hapus class active dari semua tombol
        filterBtns.forEach(b => b.classList.remove('active'));
        // Tambahkan ke tombol yang diklik
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-cat');
        filterData();
    });
});

// --- 5. MODAL LOGIC ---
function openUploadModal() {
    uploadModal.classList.add('active');
}

function openDetailModal(product) {
    document.getElementById('dImg').src = product.img;
    document.getElementById('dCat').textContent = product.category;
    document.getElementById('dTitle').textContent = product.title;
    document.getElementById('dPrice').textContent = `Rp ${product.price.toLocaleString('id-ID')}`;
    document.getElementById('dStock').textContent = `Stok Tersedia: ${product.stock} kg`;
    document.getElementById('dDesc').textContent = product.desc;
    
    // Dynamic WhatsApp Link
    const msg = `Halo, saya tertarik dengan ${product.title} yang ada di Agrilink ID.`;
    const waLink = `https://wa.me/?text=${encodeURIComponent(msg)}`; 
    
    document.getElementById('dWhatsapp').href = waLink;

    detailModal.classList.add('active');
}

function closeModals() {
    uploadModal.classList.remove('active');
    detailModal.classList.remove('active');
}

// Tutup modal jika klik di luar area konten
window.onclick = function(event) {
    if (event.target == uploadModal) closeModals();
    if (event.target == detailModal) closeModals();
}

// --- 6. UPLOAD LOGIC ---
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Handle Image (Membuat URL lokal sementara)
    const fileInput = document.getElementById('pPhoto');
    const file = fileInput.files[0];
    const imgUrl = file ? URL.createObjectURL(file) : 'https://via.placeholder.com/300';

    const newProduct = {
        id: Date.now(),
        title: document.getElementById('pName').value,
        category: document.getElementById('pCategory').value,
        price: Number(document.getElementById('pPrice').value),
        stock: Number(document.getElementById('pStock').value),
        desc: document.getElementById('pDesc').value,
        img: imgUrl
    };

    products.unshift(newProduct); // Tambah ke paling atas array
    renderProducts(products);
    uploadForm.reset();
    closeModals();
    alert("Produk berhasil diposting!");
});

// Render Awal
renderProducts(products);