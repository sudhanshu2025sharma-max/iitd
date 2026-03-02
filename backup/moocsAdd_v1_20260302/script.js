// ===== Preloader =====
window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(function () { preloader.style.display = 'none'; }, 500);
    }
});

document.addEventListener('DOMContentLoaded', function () {

    // ─────────────────────────────────────
    // TAB SWITCHING
    // ─────────────────────────────────────
    var tabButtons = document.querySelectorAll('.nav-btn[data-tab]');
    var tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tabId = this.getAttribute('data-tab');
            tabContents.forEach(function (c) { c.classList.remove('active'); });
            tabButtons.forEach(function (b) { b.classList.remove('active'); });
            var target = document.getElementById(tabId);
            if (target) {
                target.classList.add('active');
                target.classList.add('tab-switching');
                setTimeout(function () { target.classList.remove('tab-switching'); }, 400);
            }
            this.classList.add('active');
            if (window.innerWidth <= 900 && target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────
    function getBadgeClass(indexed) {
        if (!indexed) return '';
        var l = indexed.toLowerCase();
        if (l.indexOf('scopus') !== -1) return 'scopus';
        if (l.indexOf('ugc') !== -1) return 'ugc';
        if (l.indexOf('wos') !== -1) return 'wos';
        if (l.indexOf('book') !== -1) return 'book-chapter';
        return '';
    }

    function getStatusBadgeClass(status) {
        if (!status) return '';
        var l = status.toLowerCase();
        if (l.indexOf('completed') !== -1) return 'status-completed';
        if (l.indexOf('ongoing') !== -1 || l.indexOf('in progress') !== -1) return 'status-ongoing';
        if (l.indexOf('upcoming') !== -1 || l.indexOf('planned') !== -1) return 'status-upcoming';
        return '';
    }

    // ─────────────────────────────────────
    // EDUCATION & EXPERIENCE
    // ─────────────────────────────────────
    function renderTimeline(data, containerId, dateKey, titleKey, subKey) {
        var container = document.getElementById(containerId);
        if (!container || !data || !data.length) return;
        data.forEach(function (item) {
            var div = document.createElement('div');
            div.className = 'timeline-item';
            div.innerHTML =
                '<div class="timeline-date">' + item[dateKey] + '</div>' +
                '<div class="timeline-content"><h3>' + item[titleKey] + '</h3><p>' + item[subKey] + '</p></div>';
            container.appendChild(div);
        });
    }

    if (typeof EDUCATION_DATA !== 'undefined') renderTimeline(EDUCATION_DATA, 'educationTimeline', 'year', 'degree', 'institution');
    if (typeof EXPERIENCE_DATA !== 'undefined') renderTimeline(EXPERIENCE_DATA, 'experienceTimeline', 'period', 'position', 'institution');

    // ─────────────────────────────────────
    // PUBLICATIONS
    // ─────────────────────────────────────
    var pubBody = document.getElementById('publicationsBody');
    var showMoreBtn = document.getElementById('showMorePublications');
    var showMoreText = document.getElementById('showMoreText');
    var pubCountEl = document.getElementById('publicationsCount');
    var pubScrollArea = document.getElementById('publicationsScrollArea');
    var pubsShown = 0;
    var totalPubs = 0;
    var initPubCount = 5;

    if (typeof PUBLICATIONS_DATA !== 'undefined' && PUBLICATIONS_DATA.length > 0) {
        totalPubs = PUBLICATIONS_DATA.length;
        initPubCount = (typeof INITIAL_PUBLICATION_COUNT !== 'undefined') ? INITIAL_PUBLICATION_COUNT : 5;
        renderPubs(0, initPubCount, false);
    } else {
        if (pubBody) pubBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:#718096;">No publications found.</td></tr>';
        if (showMoreBtn) showMoreBtn.style.display = 'none';
    }

    function renderPubs(start, count, animate) {
        if (!pubBody) return;
        var end = Math.min(start + count, totalPubs);
        for (var i = start; i < end; i++) {
            var pub = PUBLICATIONS_DATA[i];
            var row = document.createElement('tr');
            if (animate) { row.className = 'pub-row-new'; row.style.animationDelay = ((i - start) * 0.06) + 's'; }
            row.innerHTML =
                '<td>' + (i + 1) + '</td><td>' + pub.title + '</td><td>' + pub.authors +
                '</td><td>' + pub.journal + '</td><td>' + pub.year +
                '</td><td><span class="badge ' + getBadgeClass(pub.indexed) + '">' + pub.indexed + '</span></td>';
            pubBody.appendChild(row);
        }
        pubsShown = end;
        updatePubUI();
    }

    function updatePubUI() {
        if (pubCountEl) pubCountEl.textContent = 'Showing ' + pubsShown + ' of ' + totalPubs + ' publications';
        if (showMoreBtn) {
            if (pubsShown >= totalPubs) { showMoreBtn.style.display = 'none'; }
            else {
                showMoreBtn.style.display = 'inline-flex';
                if (showMoreText) showMoreText.textContent = 'Show More (' + (totalPubs - pubsShown) + ' remaining)';
            }
        }
    }

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function () {
            renderPubs(pubsShown, totalPubs - pubsShown, true);
            if (pubScrollArea) setTimeout(function () { pubScrollArea.scrollTop = pubScrollArea.scrollHeight; }, 150);
            var ctrl = document.getElementById('publicationsControls');
            if (ctrl) {
                var n = document.createElement('div');
                n.className = 'pub-notification';
                n.textContent = 'All ' + totalPubs + ' publications loaded!';
                ctrl.appendChild(n);
                setTimeout(function () { n.style.opacity = '0'; setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 400); }, 3000);
            }
        });
    }

    // ─────────────────────────────────────
    // PROJECTS
    // ─────────────────────────────────────
    var projectsContainer = document.getElementById('projectsContainer');
    var projectsCountEl = document.getElementById('projectsCount');

    if (typeof PROJECTS_DATA !== 'undefined' && PROJECTS_DATA.length > 0) {
        renderProjects(PROJECTS_DATA);
    } else {
        if (projectsContainer) {
            projectsContainer.innerHTML = '<p class="no-data-message">No projects found.</p>';
        }
    }

    function renderProjects(projects) {
        if (!projectsContainer) return;
        
        if (projectsCountEl) {
            projectsCountEl.textContent = 'Total ' + projects.length + ' project' + (projects.length > 1 ? 's' : '');
        }

        projects.forEach(function (project, index) {
            var card = document.createElement('div');
            card.className = 'project-card';
            card.style.animationDelay = (index * 0.1) + 's';

            var statusBadge = '';
            if (project.status) {
                statusBadge = '<span class="project-status ' + getStatusBadgeClass(project.status) + '">' + project.status + '</span>';
            }

            var fundingInfo = '';
            if (project.funding) {
                fundingInfo = '<div class="project-funding"><i class="fas fa-rupee-sign"></i> ' + project.funding + '</div>';
            }

            var roleInfo = '';
            if (project.role) {
                roleInfo = '<div class="project-role"><i class="fas fa-user-tag"></i> ' + project.role + '</div>';
            }

            var descInfo = '';
            if (project.description) {
                descInfo = '<p class="project-description">' + project.description + '</p>';
            }

            card.innerHTML =
                '<div class="project-header">' +
                    '<span class="project-number">' + (index + 1) + '</span>' +
                    '<div class="project-title-wrap">' +
                        '<h3 class="project-title">' + project.title + '</h3>' +
                        statusBadge +
                    '</div>' +
                '</div>' +
                '<div class="project-meta">' +
                    '<div class="project-authors"><i class="fas fa-users"></i> ' + project.authors + '</div>' +
                    '<div class="project-org"><i class="fas fa-building"></i> ' + project.organization + '</div>' +
                    '<div class="project-year"><i class="fas fa-calendar"></i> ' + project.year + '</div>' +
                    fundingInfo +
                    roleInfo +
                '</div>' +
                descInfo;

            projectsContainer.appendChild(card);
        });
    }

    // ─────────────────────────────────────
    // PARTICIPATION
    // ─────────────────────────────────────
    function renderTableRows(data, bodyId, fields) {
        var body = document.getElementById(bodyId);
        if (!body || !data || !data.length) return;
        data.forEach(function (item, idx) {
            var row = document.createElement('tr');
            var h = '<td>' + (idx + 1) + '</td>';
            fields.forEach(function (f) { h += '<td>' + (item[f] || '') + '</td>'; });
            row.innerHTML = h;
            body.appendChild(row);
        });
    }

    if (typeof WORKSHOPS_DATA !== 'undefined') renderTableRows(WORKSHOPS_DATA, 'workshopsBody', ['title', 'organizer', 'date', 'duration']);
    if (typeof CONFERENCES_DATA !== 'undefined') renderTableRows(CONFERENCES_DATA, 'conferencesBody', ['conference', 'organizer', 'date', 'presentation']);

    // ─────────────────────────────────────
    // LECTURES
    // ─────────────────────────────────────
    if (typeof LECTURES_DATA !== 'undefined') {
        var ll = document.getElementById('lecturesList');
        if (ll) {
            LECTURES_DATA.forEach(function (item) {
                var li = document.createElement('li');
                li.innerHTML = (item.upcoming ? '<span class="upcoming-badge">Upcoming</span> ' : '') + item.text;
                ll.appendChild(li);
            });
        }
    }

    // ─────────────────────────────────────
    // ADMIN
    // ─────────────────────────────────────
    if (typeof ADMIN_DATA !== 'undefined') {
        var al = document.getElementById('adminList');
        if (al) {
            ADMIN_DATA.forEach(function (item) {
                var li = document.createElement('li');
                li.innerHTML = item.text + (item.period ? ' <span class="period-badge">' + item.period + '</span>' : '');
                al.appendChild(li);
            });
        }
    }

    // ─────────────────────────────────────
    // AUTO-FETCH GALLERY IMAGES
    // ─────────────────────────────────────
    var galleryImages = [];
    var galleryLoading = document.getElementById('galleryLoading');
    var carouselOuter = document.getElementById('carouselOuter');
    var galleryCountEl = document.getElementById('galleryCount');

    var SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    var MAX_IMAGES_TO_CHECK = 50;

    function tryLoadImage(index) {
        return new Promise(function (resolve) {
            var found = false;
            var tried = 0;
            var totalToTry = SUPPORTED_EXTENSIONS.length;

            SUPPORTED_EXTENSIONS.forEach(function (ext) {
                var img = new Image();
                var src = 'images/photo' + index + '.' + ext;

                img.onload = function () {
                    if (!found) {
                        found = true;
                        resolve({ src: src, name: 'photo' + index + '.' + ext });
                    }
                };

                img.onerror = function () {
                    tried++;
                    if (tried >= totalToTry && !found) {
                        resolve(null);
                    }
                };

                img.src = src;
            });
        });
    }

    async function scanImagesFolder() {
        var results = [];

        for (var i = 1; i <= MAX_IMAGES_TO_CHECK; i++) {
            var result = await tryLoadImage(i);
            if (result) {
                results.push(result);
            } else {
                var gapCheck = 0;
                var continueChecking = true;
                for (var j = i + 1; j <= Math.min(i + 3, MAX_IMAGES_TO_CHECK); j++) {
                    var extra = await tryLoadImage(j);
                    if (extra) {
                        results.push(extra);
                        gapCheck = j;
                    }
                }
                if (gapCheck === 0) break;
                i = gapCheck;
            }
        }

        return results;
    }

    scanImagesFolder().then(function (images) {
        galleryImages = images;

        if (galleryLoading) galleryLoading.style.display = 'none';

        if (images.length === 0) {
            if (carouselOuter) {
                carouselOuter.style.display = 'block';
                carouselOuter.innerHTML = '<p style="text-align:center;padding:30px;color:#718096;">No images found. Place files named photo1.jpg, photo2.jpg, etc. in the images/ folder.</p>';
            }
            return;
        }

        if (galleryCountEl) galleryCountEl.textContent = images.length + ' photo' + (images.length > 1 ? 's' : '') + ' found';
        if (carouselOuter) carouselOuter.style.display = 'flex';

        buildCarousel(images);
    });

    // ─────────────────────────────────────
    // CAROUSEL ENGINE
    // ─────────────────────────────────────
    var carouselTrack = document.getElementById('carouselTrack');
    var carouselViewport = document.getElementById('carouselViewport');
    var prevArrow = document.getElementById('carouselPrev');
    var nextArrow = document.getElementById('carouselNext');
    var dotsContainer = document.getElementById('carouselDots');

    var currentPage = 0;
    var totalPages = 1;
    var perView = 3;
    var autoTimer = null;

    function getSlidesPerView() {
        var w = window.innerWidth;
        if (w <= 600) return 1;
        if (w <= 900) return 2;
        return 3;
    }

    function buildCarousel(images) {
        if (!carouselTrack) return;

        carouselTrack.innerHTML = '';

        images.forEach(function (img, idx) {
            var slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.setAttribute('data-idx', idx);

            var inner = document.createElement('div');
            inner.className = 'carousel-slide-inner';

            var imgEl = document.createElement('img');
            imgEl.src = img.src;
            imgEl.alt = img.name;
            imgEl.loading = 'lazy';

            var caption = document.createElement('div');
            caption.className = 'slide-name';
            caption.textContent = img.name;

            inner.appendChild(imgEl);
            inner.appendChild(caption);
            slide.appendChild(inner);

            slide.addEventListener('click', function () {
                openImageModal(idx);
            });

            carouselTrack.appendChild(slide);
        });

        perView = getSlidesPerView();
        currentPage = 0;
        calcAndUpdate();
        startAutoPlay();
    }

    function calcAndUpdate() {
        if (!galleryImages.length || !carouselViewport) return;

        perView = getSlidesPerView();
        totalPages = Math.max(1, galleryImages.length - perView + 1);
        if (currentPage >= totalPages) currentPage = totalPages - 1;
        if (currentPage < 0) currentPage = 0;

        var viewportWidth = carouselViewport.offsetWidth;
        var gap = 16;
        var slideWidth = (viewportWidth - gap * (perView - 1)) / perView;

        var slides = carouselTrack.querySelectorAll('.carousel-slide');
        slides.forEach(function (s) {
            s.style.width = slideWidth + 'px';
            s.style.paddingLeft = (gap / 2) + 'px';
            s.style.paddingRight = (gap / 2) + 'px';
        });

        var offset = currentPage * (slideWidth + gap);
        carouselTrack.style.transform = 'translateX(-' + offset + 'px)';

        if (prevArrow) prevArrow.disabled = (currentPage <= 0);
        if (nextArrow) nextArrow.disabled = (currentPage >= totalPages - 1);

        buildDots();
    }

    function buildDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        if (totalPages <= 1) return;

        for (var i = 0; i < totalPages; i++) {
            var dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
            dot.setAttribute('data-page', i);
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            (function (pageIndex) {
                dot.addEventListener('click', function () {
                    currentPage = pageIndex;
                    calcAndUpdate();
                    restartAutoPlay();
                });
            })(i);
            dotsContainer.appendChild(dot);
        }
    }

    if (prevArrow) {
        prevArrow.addEventListener('click', function () {
            if (currentPage > 0) {
                currentPage--;
                calcAndUpdate();
                restartAutoPlay();
            }
        });
    }

    if (nextArrow) {
        nextArrow.addEventListener('click', function () {
            if (currentPage < totalPages - 1) {
                currentPage++;
                calcAndUpdate();
                restartAutoPlay();
            }
        });
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoTimer = setInterval(function () {
            if (currentPage < totalPages - 1) {
                currentPage++;
            } else {
                currentPage = 0;
            }
            calcAndUpdate();
        }, 4000);
    }

    function stopAutoPlay() {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    if (carouselViewport) {
        carouselViewport.addEventListener('mouseenter', stopAutoPlay);
        carouselViewport.addEventListener('mouseleave', startAutoPlay);
    }

    var touchSX = 0;
    if (carouselViewport) {
        carouselViewport.addEventListener('touchstart', function (e) {
            touchSX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        carouselViewport.addEventListener('touchend', function (e) {
            var diff = touchSX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 40) {
                if (diff > 0 && currentPage < totalPages - 1) currentPage++;
                else if (diff < 0 && currentPage > 0) currentPage--;
                calcAndUpdate();
            }
            startAutoPlay();
        }, { passive: true });
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            calcAndUpdate();
        }, 200);
    });

    // ─────────────────────────────────────
    // IMAGE MODAL
    // ─────────────────────────────────────
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById('modalImage');
    var modalCaption = document.getElementById('modalCaption');
    var modalCounter = document.getElementById('modalCounter');
    var modalCloseBtn = document.getElementById('modalClose');
    var modalPrevBtn = document.getElementById('modalPrev');
    var modalNextBtn = document.getElementById('modalNext');
    var modalIdx = 0;

    function openImageModal(index) {
        if (!modal || !galleryImages.length) return;
        modalIdx = index;
        showModalImage();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        stopAutoPlay();
    }

    function closeImageModal() {
        if (!modal) return;
        modal.classList.remove('show');
        document.body.style.overflow = '';
        startAutoPlay();
    }

    function showModalImage() {
        if (!modalImg || !galleryImages[modalIdx]) return;
        var photo = galleryImages[modalIdx];
        modalImg.src = photo.src;
        modalImg.alt = photo.name;
        if (modalCaption) modalCaption.textContent = photo.name;
        if (modalCounter) modalCounter.textContent = (modalIdx + 1) + ' / ' + galleryImages.length;
    }

    function modalGoPrev() {
        modalIdx = (modalIdx > 0) ? modalIdx - 1 : galleryImages.length - 1;
        showModalImage();
    }

    function modalGoNext() {
        modalIdx = (modalIdx < galleryImages.length - 1) ? modalIdx + 1 : 0;
        showModalImage();
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeImageModal);
    if (modalPrevBtn) modalPrevBtn.addEventListener('click', modalGoPrev);
    if (modalNextBtn) modalNextBtn.addEventListener('click', modalGoNext);

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal || e.target.classList.contains('modal-body')) closeImageModal();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (!modal || !modal.classList.contains('show')) return;
        if (e.key === 'Escape') closeImageModal();
        if (e.key === 'ArrowLeft') modalGoPrev();
        if (e.key === 'ArrowRight') modalGoNext();
    });

    var mTouchSX = 0;
    if (modal) {
        modal.addEventListener('touchstart', function (e) {
            mTouchSX = e.changedTouches[0].screenX;
        }, { passive: true });

        modal.addEventListener('touchend', function (e) {
            var diff = mTouchSX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) modalGoNext();
                else modalGoPrev();
            }
        }, { passive: true });
    }

    // ─────────────────────────────────────
    // TIMELINE ANIMATION
    // ─────────────────────────────────────
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.timeline-item').forEach(function (item) {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });

});