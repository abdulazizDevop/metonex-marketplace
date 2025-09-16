// Custom JavaScript for MetOneX Marketplace Admin
document.addEventListener('DOMContentLoaded', function() {
    console.log('MetOneX Admin Custom JS Loaded!');

    // Example: Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            const saveButton = document.querySelector('input[name="_save"]');
            if (saveButton) {
                saveButton.click();
                console.log('Ctrl+S pressed: Save button clicked!');
            }
        }
        if (event.ctrlKey && event.key === 'f') {
            event.preventDefault();
            const searchBar = document.querySelector('#searchbar');
            if (searchBar) {
                searchBar.focus();
                console.log('Ctrl+F pressed: Search bar focused!');
            }
        }
    });

    // Example: Dark mode toggle (if not handled by django-admin-interface)
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            console.log('Dark mode toggled!');
        });
    }

    // Add tooltips to action buttons
    document.querySelectorAll('a.button').forEach(button => {
        const text = button.textContent.trim();
        button.setAttribute('title', text);
    });

    // Add loading state to forms on submit
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            const submitButtons = form.querySelectorAll('input[type="submit"], button[type="submit"]');
            submitButtons.forEach(button => {
                button.disabled = true;
                button.textContent = 'Yuklanmoqda...'; // Loading text
                button.style.opacity = '0.7';
                button.style.cursor = 'not-allowed';
            });
        });
    });

    // Add hover effects to stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click effects to buttons
    document.querySelectorAll('.button, input[type="submit"]').forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add confirmation dialogs for delete actions
    document.querySelectorAll('a[href*="delete"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
                e.preventDefault();
            }
        });
    });

    // Add auto-refresh for dashboard stats (every 30 seconds)
    if (window.location.pathname.includes('metone/')) {
        setInterval(function() {
            // Only refresh if user is on dashboard
            if (window.location.pathname.endsWith('metone/')) {
                location.reload();
            }
        }, 30000);
    }

    // Add custom notifications
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Add CSS for notification animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Add global notification function
    window.showNotification = showNotification;

    console.log('MetOneX Admin Custom JS Initialized Successfully!');
});
