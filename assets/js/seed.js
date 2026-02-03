
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
            institution: 'Colegio San Mateo',
            position: 'Profesor de Matemáticas (Reemplazo)',
            region: 'Región Metropolitana de Santiago',
            comuna: 'Providencia',
            contact: 'contacto@colegiosanmateo.cl',
            urgency: 'alta',
            postedBy: 'admin@clasehoy.cl'
        },
        {
            institution: 'Liceo Bicentenario',
            position: 'Docente de Lenguaje - 30 hrs',
            region: 'Valparaíso',
            comuna: 'Viña del Mar',
            contact: 'utp@liceobicentenario.cl',
            urgency: 'normal',
            postedBy: 'admin@clasehoy.cl'
        },
        {
            institution: 'Escuela Rural Los Andes',
            position: 'Profesor General Básica',
            region: 'Los Lagos',
            comuna: 'Puerto Montt',
            contact: 'director@escuelalosandes.cl',
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
