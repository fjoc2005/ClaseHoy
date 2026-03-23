document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.getElementById("posts-container");
    const navButtons = document.getElementById("nav-buttons");
    const notificationContainer = document.getElementById("notification-container");
    
    let currentUser = null;
    let allPosts = [];

    // Modal
    const welcomeModal = document.getElementById("welcome-modal");
    if (!localStorage.getItem('clasehoy_welcome_seen')) {
        welcomeModal.style.display = 'flex';
    }

    window.closeWelcomeModal = function() {
        welcomeModal.style.display = 'none';
        localStorage.setItem('clasehoy_welcome_seen', 'true');
    };

    // Cargar filtros
    const regionSelect = document.getElementById("filter-region");
    const comunaSelect = document.getElementById("filter-comuna");
    const profesionSelect = document.getElementById("filter-profesion");

    ChileData.getRegionNames().forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });

    regionSelect.addEventListener("change", () => {
        const region = regionSelect.value;
        comunaSelect.innerHTML = '<option value="">🏘️ Todas las comunas</option>';
        if (region) {
            ChileData.getComunasByRegion(region).forEach(comuna => {
                const option = document.createElement("option");
                option.value = comuna;
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        }
    });

    ChileData.subjects.forEach(prof => {
        const option = document.createElement("option");
        option.value = prof;
        option.textContent = prof;
        profesionSelect.appendChild(option);
    });

    document.getElementById("filter-tipo").addEventListener("change", applyFilters);
    document.getElementById("filter-region").addEventListener("change", applyFilters);
    document.getElementById("filter-comuna").addEventListener("change", applyFilters);
    document.getElementById("filter-profesion").addEventListener("change", applyFilters);

    function applyFilters() {
        const tipo = document.getElementById("filter-tipo").value;
        const region = document.getElementById("filter-region").value;
        const comuna = document.getElementById("filter-comuna").value;
        const profesion = document.getElementById("filter-profesion").value;

        const filtered = allPosts.filter(post => {
            if (tipo && post.tipo !== tipo) return false;
            if (region && post.region !== region) return false;
            if (comuna && post.comuna !== comuna) return false;
            if (profesion && post.profesion !== profesion) return false;
            return true;
        });

        renderPosts(filtered);
    }

    firebase.auth().onAuthStateChanged(user => {
        currentUser = user;
        renderNavButtons();
    });

    function renderNavButtons() {
        if (currentUser) {
            navButtons.innerHTML = `
                <a href="post-job.html" class="btn btn-primary">📝 Publicar Aviso</a>
                <button onclick="logout()" class="btn btn-secondary">🚪 Cerrar Sesión</button>
            `;
        } else {
            navButtons.innerHTML = `
                <a href="register.html" class="btn btn-primary">✨ Registrarse Gratis</a>
                <a href="login.html" class="btn btn-secondary">🔐 Iniciar Sesión</a>
            `;
        }
    }

    window.logout = function() {
        firebase.auth().signOut().then(() => location.reload());
    };

    function showNotification(message, type = 'info') {
        const div = document.createElement("div");
        div.className = `notification ${type}`;
        div.textContent = message;
        notificationContainer.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }

    function getTimeRemaining(expiresAt) {
        if (!expiresAt) return '⏰ Expirado';
        const now = new Date();
        const expires = expiresAt.toDate();
        const diff = expires - now;
        if (diff <= 0) return '⏰ Expirado';
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) return `⏰ ${hours}h ${minutes}m`;
        return `⏰ ${minutes}m`;
    }

    window.showContact = function(email) {
        showNotification(`📧 Contacto: ${email}`, 'info');
    };

    window.deletePost = async function(postId) {
        if (!confirm('¿Seguro que deseas eliminar este aviso?')) return;
        try {
            await db.collection("posts").doc(postId).delete();
            showNotification('✅ Aviso eliminado', 'success');
        } catch (error) {
            showNotification('❌ Error al eliminar', 'error');
        }
    };

    function renderPosts(posts) {
        if (posts.length === 0) {
            const isLoggedIn = currentUser !== null;
            postsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3 class="empty-title">¡Sé el primero en publicar!</h3>
                    <p class="empty-text">
                        No hay avisos con estos filtros. ${isLoggedIn ? 'Publica' : 'Regístrate y publica'} el primero.
                    </p>
                    ${isLoggedIn 
                        ? '<a href="post-job.html" class="btn btn-accent">📝 Publicar Ahora</a>'
                        : '<a href="register.html" class="btn btn-accent">✨ Registrarse Gratis</a>'
                    }
                </div>
            `;
            return;
        }

        postsContainer.innerHTML = posts.map(post => {
            const tipoClass = `tipo-${post.tipo}`;
            const badgeClass = post.tipo === 'ofrezco' ? 'badge-ofrezco' : 'badge-busco';
            const badgeText = post.tipo === 'ofrezco' ? '🟢 OFREZCO' : '🔵 BUSCO';
            
            let contactHTML = '';
            if (currentUser) {
                contactHTML = `<button onclick="showContact('${post.email}')" class="btn btn-accent btn-contact">📧 Ver Contacto</button>`;
            } else {
                contactHTML = `<div class="post-locked"><p>🔒 <a href="login.html">Inicia sesión</a> para ver el contacto</p></div>`;
            }
            
            const isOwner = currentUser && currentUser.uid === post.userId;
            const deleteBtn = isOwner ? `<button onclick="deletePost('${post.id}')" class="btn btn-delete">🗑️ Eliminar</button>` : '';

            return `
                <div class="post-card ${tipoClass}">
                    <span class="post-badge ${badgeClass}">${badgeText}</span>
                    <div class="post-header">
                        <h3 class="post-title">${post.nombre}</h3>
                        <span class="post-time">${post.timeRemaining}</span>
                    </div>
                    <div class="post-info">
                        <div class="info-item"><strong>📚</strong> ${post.profesion}</div>
                        <div class="info-item"><strong>📍</strong> ${post.comuna}, ${post.region}</div>
                        <div class="info-item"><strong>⏰</strong> ${post.disponibilidad}</div>
                    </div>
                    ${post.descripcion ? `<p class="post-description">${post.descripcion}</p>` : ''}
                    <div class="post-actions">
                        ${contactHTML}
                        ${deleteBtn}
                    </div>
                </div>
            `;
        }).join('');
    }

    db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snapshot => {
        const now = new Date();
        allPosts = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
                timeRemaining: getTimeRemaining(doc.data().expiresAt)
            }))
            .filter(post => post.expiresAt && post.expiresAt.toDate() > now);
        applyFilters();
    }, error => {
        postsContainer.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><h3 class="empty-title">Error al cargar</h3></div>`;
    });
});
