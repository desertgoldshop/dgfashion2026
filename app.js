(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      menuButton.classList.toggle('open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        document.body.classList.remove('menu-open');
        menuButton.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  document.querySelectorAll('[data-newsletter-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (!input || !input.value) return;
      var subject = encodeURIComponent('Desert Gold collection updates');
      var body = encodeURIComponent('Please add ' + input.value + ' to the Desert Gold collection update list.');
      window.location.href = 'mailto:desergoldshop2026@outlook.com?subject=' + subject + '&body=' + body;
    });
  });

  document.querySelectorAll('[data-year]').forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  var productGrid = document.querySelector('[data-product-grid]');
  if (productGrid) {
    var cards = Array.prototype.slice.call(productGrid.querySelectorAll('[data-product-card]'));
    var searchInput = document.querySelector('[data-product-search]');
    var sortSelect = document.querySelector('[data-product-sort]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-category-filter]'));
    var countNode = document.querySelector('[data-product-count]');
    var emptyNode = document.querySelector('[data-catalog-empty]');
    var clearButton = document.querySelector('[data-clear-filters]');
    var activeCategory = 'all';

    function setActiveButton() {
      filterButtons.forEach(function (button) {
        var selected = button.getAttribute('data-category-filter') === activeCategory;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    }

    function updateCatalog() {
      var query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      var visible = cards.filter(function (card) {
        var categoryMatch = activeCategory === 'all' || card.getAttribute('data-category') === activeCategory;
        var searchMatch = !query || card.getAttribute('data-name').indexOf(query) !== -1;
        card.hidden = !(categoryMatch && searchMatch);
        return !card.hidden;
      });

      var sortValue = sortSelect ? sortSelect.value : 'featured';
      visible.sort(function (a, b) {
        if (sortValue === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
        if (sortValue === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
        if (sortValue === 'name') return a.dataset.name.localeCompare(b.dataset.name);
        return Number(b.dataset.priority) - Number(a.dataset.priority);
      });
      visible.forEach(function (card) { productGrid.appendChild(card); });
      if (countNode) countNode.textContent = visible.length + (visible.length === 1 ? ' style' : ' styles');
      if (emptyNode) emptyNode.hidden = visible.length !== 0;
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeCategory = button.getAttribute('data-category-filter');
        setActiveButton();
        history.replaceState(null, '', activeCategory === 'all' ? 'collection.html' : '#' + activeCategory);
        updateCatalog();
      });
    });
    if (searchInput) searchInput.addEventListener('input', updateCatalog);
    if (sortSelect) sortSelect.addEventListener('change', updateCatalog);
    if (clearButton) clearButton.addEventListener('click', function () {
      activeCategory = 'all';
      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'featured';
      setActiveButton();
      updateCatalog();
    });

    var hashCategory = window.location.hash.slice(1);
    if (filterButtons.some(function (button) { return button.getAttribute('data-category-filter') === hashCategory; })) activeCategory = hashCategory;
    setActiveButton();
    updateCatalog();
  }
})();
