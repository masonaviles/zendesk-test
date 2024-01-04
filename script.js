hljs.initHighlightingOnLoad();

const HC_SETTINGS = {
  css: {
    activeClass: 'is-active',
    hiddenClass: 'is-hidden',
  },
};

$(() => {
  SearchResultsFilters.init();
  const $window = $(window);
  const $body = $('body');
  const $topbar = $('[data-topbar]');
  const $mainMenu = $('[data-menu]');
  const $mobileSandwich = $('[data-toggle-menu]');
  const $overlay = $('<div class="body-overlay"></div>');

  $body.append($overlay[0]);

  $mobileSandwich.click(function () {
    $(this).add($mainMenu).add($topbar).toggleClass(HC_SETTINGS.css.activeClass);

    $mainMenu.slideToggle(300);
    $body.toggleClass('menu-opened');
  });

  function mobileMenuClose(e, desktop) {
    if ($mobileSandwich.hasClass(HC_SETTINGS.css.activeClass)) {
      $mobileSandwich.add($mainMenu).add($topbar).removeClass(HC_SETTINGS.css.activeClass);

      $mainMenu.slideUp(desktop ? 0 : 300);
      $body.removeClass('menu-opened');
    }
  }

  $overlay.on('click', mobileMenuClose);

  $window.on('resize', () => {
    if ($window.width() > 991) {
      mobileMenuClose(null, true);
    }
  });

  // Social share popups
  $('.share a').click(function (e) {
    e.preventDefault();
    window.open(this.href, '', 'height = 500, width = 500');
  });

  // Toggle the share dropdown in communities
  $('.share-label').on('click', function (e) {
    e.stopPropagation();
    const isSelected = this.getAttribute('aria-selected') === 'true';
    this.setAttribute('aria-selected', !isSelected);
    $('.share-label').not(this).attr('aria-selected', 'false');
  });

  $(document).on('click', () => {
    $('.share-label').attr('aria-selected', 'false');
  });

  $('.dropdown-toggle').on('click', (e) => {
    e.preventDefault();
  });

  function search() {
    window.location.search = $.param({
      query: $('#quick-search').val(),
      status: $('#request-status-select').val(),
      organization_id: $('#request-organization-select').val(),
    });
  }

  // Submit search on select change
  $('#request-status-select, #request-organization-select').on('change', () => {
    search();
  });

  // Submit search on input enter
  $('#quick-search').on('keypress', (e) => {
    if (e.which === 13) {
      search();
    }
  });

  $('.image-with-lightbox').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-with-zoom', // class to remove default margin from left and right side
    image: {
      verticalFit: true,
    },
    zoom: {
      enabled: true,
      duration: 300, // don't foget to change the duration also in CSS
    },
  });

  $('.image-with-video-icon').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  $('.accordion__item-title').on('click', function () {
    const $title = $(this);
    $title.toggleClass('accordion__item-title--active');
    $title.parents('.accordion__item').find('.accordion__item-content').slideToggle();
  });

  $('.tabs-link').click(function (e) {
    e.preventDefault();
    const $link = $(this);
    const tabIndex = $link.index();
    const $tab = $link.parents('.tabs').find('.tab').eq(tabIndex);
    $link.addClass(HC_SETTINGS.css.activeClass).siblings().removeClass(HC_SETTINGS.css.activeClass);
    $tab
      .removeClass(HC_SETTINGS.css.hiddenClass)
      .siblings('.tab')
      .addClass(HC_SETTINGS.css.hiddenClass);
  });

  // Fix animated icons
  $('.fa-spin').empty();

  // Add asset part to required images
  let assetPart = $('[property]').attr('content');
  const $assetElement = $('[data-asset]');

  if (assetPart) {
    assetPart = assetPart.slice(0, -5);
    $assetElement.each(function () {
      const $this = $(this);
      const link = $this.data('asset');

      $this.attr('src', assetPart + link).css('opacity', 1);
    });
  }

  // Underline
  $('[data-underline]').each(function () {
    const $text = $(this);
    const word = $text.data('underline');
    const html = $text.html();

    $text.html(html.replace(new RegExp(word, 'g'), `<span class="underline">${word}</span>`));
  });

  $('img.custom-block__image').each(function () {
    const $img = $(this);
    const imgID = $img.attr('id');
    const imgClass = $img.attr('class');
    const imgURL = `${$img.attr('src')}?reset`;

    $.get(
      imgURL,
      (data) => {
        // Get the SVG tag, ignore the rest
        let $svg = $(data).find('svg');

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', `${imgClass} replaced-svg`);
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Replace image with new SVG
        $img.replaceWith($svg);
      },
      'xml',
    );
  });

  // Category tree
  $('[data-tree]').each((i, element) => {
    const $item = $(element);
    const $link = $item.find('[data-tree-link]');
    const $box = $item.find('[data-tree-box]');

    $link.on('click', (e) => {
      e.preventDefault();
      $link.add($item).add($box).toggleClass(HC_SETTINGS.css.activeClass);
      $box.slideToggle(300);
    });
  });
});
