
/**
 * Seed Script for ClaseHoy
 * Usage: Open console in index.html and paste this, or include it temporarily.
 */
async function seedDatabase() {
    console.log("Seeding database...");

    // Check if BackendService is available
    if (typeof BackendService === 'undefined') {
        console.error("BackendService not found");
        return;
    }

    const demos = [
        {
            institution: 'Prof. Andrea Muñoz',
            position: 'Reemplazo Matemáticas - 1 Sem',
            region: 'Región Metropolitana de Santiago',
            comuna: 'Providencia',
            contact: 'andrea.munoz@gmail.com',
            urgency: 'alta',
            postedBy: 'admin@clasehoy.cl'
        },
        {
            institution: 'Prof. Ricardo Lagos',
            position: 'Docente Lenguaje - 30 hrs',
            region: 'Valparaíso',
            comuna: 'Viña del Mar',
            contact: 'ricardo.lagos@gmail.com',
            urgency: 'normal',
            postedBy: 'admin@clasehoy.cl'
        },
        {
            institution: 'Prof. Claudia Pérez',
            position: 'General Básica - Tarde',
            region: 'Los Lagos',
            comuna: 'Puerto Montt',
            contact: 'claudia.perez@gmail.com',
            urgency: 'normal',
            postedBy: 'admin@clasehoy.cl'
        }
    ];

    for (const job of demos) {
        await BackendService.saveRemoteJob(job);
    }

    console.log("Seeding complete!");
    alert("3 Demo Jobs Created!");
}

// Auto-run if flag is set or just expose it
window.seedDatabase = seedDatabase;
// Uncomment to run immediately on load (warning: duplicates if re-run)
// seedDatabase();
