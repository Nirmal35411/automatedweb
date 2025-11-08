// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('AutomatedWeb Demo loaded successfully!');
    
    // Initialize demo button functionality
    initializeDemoButton();
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // Add animation to feature cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Demo button functionality
function initializeDemoButton() {
    const button = document.getElementById('demoButton');
    const demoText = document.getElementById('demoText');
    
    if (!button || !demoText) {
        console.error('Demo button or text element not found');
        return;
    }
    
    let clickCount = 0;
    const messages = [
        '✨ Welcome to the demo!',
        '🚀 This site is deployed on Vercel!',
        '⚡ Built with Vite for blazing fast performance!',
        '🎉 Click counter: {count}',
        '👋 Thanks for exploring!'
    ];
    
    button.addEventListener('click', () => {
        clickCount++;
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
        
        // Update message
        const messageIndex = Math.min(clickCount - 1, messages.length - 1);
        let message = messages[messageIndex];
        
        // Replace counter placeholder
        if (message.includes('{count}')) {
            message = message.replace('{count}', clickCount);
        }
        
        // Animate text change
        demoText.style.opacity = '0';
        demoText.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            demoText.textContent = message;
            demoText.style.opacity = '1';
            demoText.style.transform = 'translateY(0)';
        }, 200);
        
        // Log to console
        console.log(`Button clicked ${clickCount} time(s)`);
    });
    
    // Add transition styles
    demoText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}

// Log deployment info
console.log('%c AutomatedWeb ', 'background: #6366f1; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold');
console.log('Deployed with Vite + Vercel');
console.log('Repository: https://github.com/Nirmal35411/automatedweb');

// Export for potential module usage
export { initializeDemoButton };