
        // Preloader
        window.addEventListener('load', function() {
            const preloader = document.getElementById('preloader');
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });

        // Tab Switching Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const tabButtons = document.querySelectorAll('.nav-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            
            // Function to switch tabs
            function switchTab(tabId) {
                // Hide all tab contents
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // Remove active class from all buttons
                tabButtons.forEach(button => {
                    button.classList.remove('active');
                });
                
                // Show selected tab content
                document.getElementById(tabId).classList.add('active');
                
                // Add active class to clicked button
                event.currentTarget.classList.add('active');
                
                // Add animation effect
                document.getElementById(tabId).classList.add('tab-switching');
                setTimeout(() => {
                    document.getElementById(tabId).classList.remove('tab-switching');
                }, 400);
            }
            
            // Add click event listeners to tab buttons
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    switchTab(tabId);
                });
            });
            
            // Show more publications functionality
            const showMoreBtn = document.getElementById('showMorePublications');
            if (showMoreBtn) {
                showMoreBtn.addEventListener('click', function() {
                    const tableBody = document.querySelector('#publications .data-table tbody');
                    
                    // Add more publication rows (simulated data)
                    const additionalPublications = [
                        ['A quantitative analysis of Lis Links discussion forum', 'Garg, M., and Kanjilal, U.', 'Annals of Library and Information Studies', '2021', 'Scopus'],
                        ['A Framework to process Text Data of Web Discussion Forums A Study of LisLinks', 'Garg, M., and Kanjilal, U.', 'DESIDOC Journal of Library & Information Technology', '2019', 'Scopus'],
                        ['Assessment of YouTube Videos on H Index', 'Garg, M.', 'SRELS Journal of Information Management', '2019', 'UGC CARE'],
                        ['Accountability in Research: A Bibliometric Analysis', 'Garg, M., and Priya', 'Library Herald', '2019', 'UGC CARE'],
                        ['Researchgate in Scholarly Communication: A Bibliometric Analysis', 'Garg, M.', 'Emerging Trends for Smart Libraries', '2019', 'Book Chapter']
                    ];
                    
                    additionalPublications.forEach(pub => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${pub[0]}</td>
                            <td>${pub[1]}</td>
                            <td>${pub[2]}</td>
                            <td>${pub[3]}</td>
                            <td><span class="badge ${pub[4].toLowerCase().includes('scopus') ? 'scopus' : pub[4].toLowerCase().includes('ugc') ? 'ugc' : ''}">${pub[4]}</span></td>
                        `;
                        tableBody.appendChild(row);
                    });
                    
                    // Hide the button after clicking
                    showMoreBtn.style.display = 'none';
                    
                    // Show notification
                    const notification = document.createElement('div');
                    notification.textContent = 'Additional publications loaded successfully!';
                    notification.style.cssText = `
                        background-color: #4caf50;
                        color: white;
                        padding: 12px 20px;
                        border-radius: var(--border-radius);
                        margin-top: 20px;
                        text-align: center;
                        animation: fadeIn 0.5s ease;
                    `;
                    showMoreBtn.parentNode.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.style.opacity = '0';
                        notification.style.transition = 'opacity 0.5s ease';
                        setTimeout(() => notification.remove(), 500);
                    }, 3000);
                });
            }
            
            // Initialize the first tab as active
            document.querySelector('.nav-btn.active').click();
            
            // Gallery image hover effect enhancement
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'var(--shadow)';
                });
            });
            
            // Add animation to timeline items on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }
                });
            }, observerOptions);
            
            // Observe timeline items
            document.querySelectorAll('.timeline-item').forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(item);
            });
        });
