/**
 * CalseHoy - Testimonials System
 * Handles storage, retrieval, and rendering of user reviews.
 */

const Testimonials = {
    // Storage Key
    STORAGE_KEY: 'clasehoy_reviews',

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderPublicReviews();
    },

    cacheDOM() {
        this.reviewsContainer = document.getElementById('reviews-container');
        this.reviewForm = document.getElementById('review-form');
        this.adminTableBody = document.getElementById('admin-reviews-body');
    },

    bindEvents() {
        if (this.reviewForm) {
            this.reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReview(e.target);
            });
        }
    },

    /* --- Data Management --- */

    getReviews() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveReviews(reviews) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reviews));
    },

    addReview(reviewData) {
        const reviews = this.getReviews();
        const newReview = {
            id: Date.now().toString(),
            name: reviewData.name,
            rating: parseInt(reviewData.rating), // 1-5
            comment: reviewData.comment,
            status: 'pending', // pending, approved, rejected
            date: new Date().toISOString()
        };
        reviews.unshift(newReview);
        this.saveReviews(reviews);
        return newReview;
    },

    updateStatus(id, newStatus) {
        const reviews = this.getReviews();
        const review = reviews.find(r => r.id === id);
        if (review) {
            review.status = newStatus;
            this.saveReviews(reviews);
            return true;
        }
        return false;
    },

    /* --- Public Logic --- */

    submitReview(form) {
        const formData = new FormData(form);
        const reviewData = {
            name: formData.get('name'),
            rating: formData.get('rating'),
            comment: formData.get('comment')
        };

        this.addReview(reviewData);
        alert('¡Gracias por tu valoración! Tu comentario ha sido enviado a moderación.');
        form.reset();
    },

    renderPublicReviews() {
        if (!this.reviewsContainer) return;

        const allReviews = this.getReviews();
        const approvedReviews = allReviews.filter(r => r.status === 'approved');

        if (approvedReviews.length === 0) {
            this.reviewsContainer.innerHTML = '<p class="text-center text-muted">Aún no hay valoraciones. ¡Sé el primero!</p>';
            return;
        }

        this.reviewsContainer.innerHTML = approvedReviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="stars">${this.renderStars(review.rating)}</div>
                    <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                </div>
                <p class="review-comment">"${review.comment}"</p>
                <div class="review-author">- ${review.name}</div>
            </div>
        `).join('');
    },

    renderStars(count) {
        return '★'.repeat(count) + '☆'.repeat(5 - count);
    },

    /* --- Admin Logic --- */

    renderAdminTable() {
        if (!this.adminTableBody) return;

        const reviews = this.getReviews();

        if (reviews.length === 0) {
            this.adminTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay reseñas.</td></tr>';
            return;
        }

        this.adminTableBody.innerHTML = reviews.map(review => `
            <tr class="status-${review.status}">
                <td>${review.name}</td>
                <td>${this.renderStars(review.rating)}</td>
                <td>${review.comment}</td>
                <td><span class="badge badge-${review.status}">${review.status}</span></td>
                <td>
                    ${review.status !== 'approved' ?
                `<button class="btn-xs btn-success" onclick="Testimonials.adminApprove('${review.id}')">Aprobar</button>` : ''}
                    ${review.status !== 'rejected' ?
                `<button class="btn-xs btn-danger" onclick="Testimonials.adminReject('${review.id}')">Rechazar</button>` : ''}
                </td>
            </tr>
        `).join('');
    },

    adminApprove(id) {
        this.updateStatus(id, 'approved');
        this.renderAdminTable();
    },

    adminReject(id) {
        this.updateStatus(id, 'rejected');
        this.renderAdminTable();
    }
};

// Auto-init specific contexts if needed locally, but usually triggered by page load
// window.Testimonials = Testimonials;
