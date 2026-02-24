/**
 * Chilean Administrative Division Data
 * Regions, Provinces, and Communes
 */

const ChileData = {
    regions: [
        {
            id: 'XV',
            nombre: 'Arica y Parinacota',
            provincias: [
                {
                    nombre: 'Arica',
                    comunas: ['Arica', 'Camarones']
                },
                {
                    nombre: 'Parinacota',
                    comunas: ['Putre', 'General Lagos']
                }
            ]
        },
        {
            id: 'I',
            nombre: 'Tarapacá',
            provincias: [
                {
                    nombre: 'Iquique',
                    comunas: ['Iquique', 'Alto Hospicio']
                },
                {
                    nombre: 'Tamarugal',
                    comunas: ['Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica']
                }
            ]
        },
        {
            id: 'II',
            nombre: 'Antofagasta',
            provincias: [
                {
                    nombre: 'Antofagasta',
                    comunas: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal']
                },
                {
                    nombre: 'El Loa',
                    comunas: ['Calama', 'Ollagüe', 'San Pedro de Atacama']
                },
                {
                    nombre: 'Tocopilla',
                    comunas: ['Tocopilla', 'María Elena']
                }
            ]
        },
        {
            id: 'III',
            nombre: 'Atacama',
            provincias: [
                {
                    nombre: 'Copiapó',
                    comunas: ['Copiapó', 'Caldera', 'Tierra Amarilla']
                },
                {
                    nombre: 'Chañaral',
                    comunas: ['Chañaral', 'Diego de Almagro']
                },
                {
                    nombre: 'Huasco',
                    comunas: ['Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco']
                }
            ]
        },
        {
            id: 'IV',
            nombre: 'Coquimbo',
            provincias: [
                {
                    nombre: 'Elqui',
                    comunas: ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña']
                },
                {
                    nombre: 'Choapa',
                    comunas: ['Illapel', 'Canela', 'Los Vilos', 'Salamanca']
                },
                {
                    nombre: 'Limarí',
                    comunas: ['Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado']
                }
            ]
        },
        {
            id: 'V',
            nombre: 'Valparaíso',
            provincias: [
                {
                    nombre: 'Valparaíso',
                    comunas: ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar']
                },
                {
                    nombre: 'Isla de Pascua',
                    comunas: ['Isla de Pascua']
                },
                {
                    nombre: 'Los Andes',
                    comunas: ['Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban']
                },
                {
                    nombre: 'Petorca',
                    comunas: ['La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar']
                },
                {
                    nombre: 'Quillota',
                    comunas: ['Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales']
                },
                {
                    nombre: 'San Antonio',
                    comunas: ['San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo']
                },
                {
                    nombre: 'San Felipe de Aconcagua',
                    comunas: ['San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María']
                },
                {
                    nombre: 'Marga Marga',
                    comunas: ['Quilpué', 'Limache', 'Olmué', 'Villa Alemana']
                }
            ]
        },
        {
            id: 'RM',
            nombre: 'Metropolitana de Santiago',
            provincias: [
                {
                    nombre: 'Santiago',
                    comunas: ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura']
                },
                {
                    nombre: 'Cordillera',
                    comunas: ['Puente Alto', 'Pirque', 'San José de Maipo']
                },
                {
                    nombre: 'Chacabuco',
                    comunas: ['Colina', 'Lampa', 'Tiltil']
                },
                {
                    nombre: 'Maipo',
                    comunas: ['San Bernardo', 'Buin', 'Calera de Tango', 'Paine']
                },
                {
                    nombre: 'Melipilla',
                    comunas: ['Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro']
                },
                {
                    nombre: 'Talagante',
                    comunas: ['Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor']
                }
            ]
        },
        {
            id: 'VI',
            nombre: "Libertador General Bernardo O'Higgins",
            provincias: [
                {
                    nombre: 'Cachapoal',
                    comunas: ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente']
                },
                {
                    nombre: 'Cardenal Caro',
                    comunas: ['Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones']
                },
                {
                    nombre: 'Colchagua',
                    comunas: ['San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz']
                }
            ]
        },
        {
            id: 'VII',
            nombre: 'Maule',
            provincias: [
                {
                    nombre: 'Talca',
                    comunas: ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael']
                },
                {
                    nombre: 'Cauquenes',
                    comunas: ['Cauquenes', 'Chanco', 'Pelluhue']
                },
                {
                    nombre: 'Curicó',
                    comunas: ['Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén']
                },
                {
                    nombre: 'Linares',
                    comunas: ['Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas']
                }
            ]
        },
        {
            id: 'XVI',
            nombre: 'Ñuble',
            provincias: [
                {
                    nombre: 'Diguillín',
                    comunas: ['Chillán', 'Bulnes', 'Chillán Viejo', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay']
                },
                {
                    nombre: 'Itata',
                    comunas: ['Quirihue', 'Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Ranquil', 'Treguaco']
                },
                {
                    nombre: 'Punilla',
                    comunas: ['San Carlos', 'Coihueco', 'Ñiquén', 'San Fabián', 'San Nicolás']
                }
            ]
        },
        {
            id: 'VIII',
            nombre: 'Biobío',
            provincias: [
                {
                    nombre: 'Concepción',
                    comunas: ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén']
                },
                {
                    nombre: 'Arauco',
                    comunas: ['Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa']
                },
                {
                    nombre: 'Biobío',
                    comunas: ['Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío']
                }
            ]
        },
        {
            id: 'IX',
            nombre: 'La Araucanía',
            provincias: [
                {
                    nombre: 'Cautín',
                    comunas: ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol']
                },
                {
                    nombre: 'Malleco',
                    comunas: ['Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria']
                }
            ]
        },
        {
            id: 'XIV',
            nombre: 'Los Ríos',
            provincias: [
                {
                    nombre: 'Valdivia',
                    comunas: ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli']
                },
                {
                    nombre: 'Ranco',
                    comunas: ['La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno']
                }
            ]
        },
        {
            id: 'X',
            nombre: 'Los Lagos',
            provincias: [
                {
                    nombre: 'Llanquihue',
                    comunas: ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas']
                },
                {
                    nombre: 'Chiloé',
                    comunas: ['Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao']
                },
                {
                    nombre: 'Osorno',
                    comunas: ['Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo']
                },
                {
                    nombre: 'Palena',
                    comunas: ['Chaitén', 'Futaleufú', 'Hualaihué', 'Palena']
                }
            ]
        },
        {
            id: 'XI',
            nombre: 'Aysén del General Carlos Ibáñez del Campo',
            provincias: [
                {
                    nombre: 'Coyhaique',
                    comunas: ['Coyhaique', 'Lago Verde']
                },
                {
                    nombre: 'Aysén',
                    comunas: ['Aysén', 'Cisnes', 'Guaitecas']
                },
                {
                    nombre: 'Capitán Prat',
                    comunas: ['Cochrane', 'O\'Higgins', 'Tortel']
                },
                {
                    nombre: 'General Carrera',
                    comunas: ['Chile Chico', 'Río Ibáñez']
                }
            ]
        },
        {
            id: 'XII',
            nombre: 'Magallanes y de la Antártica Chilena',
            provincias: [
                {
                    nombre: 'Magallanes',
                    comunas: ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio']
                },
                {
                    nombre: 'Antártica Chilena',
                    comunas: ['Cabo de Hornos', 'Antártica']
                },
                {
                    nombre: 'Tierra del Fuego',
                    comunas: ['Porvenir', 'Primavera', 'Timaukel']
                },
                {
                    nombre: 'Última Esperanza',
                    comunas: ['Natales', 'Torres del Paine']
                }
            ]
        }
    ],

    // Lista completa de profesiones y cargos educativos en Chile
    subjects: [
        'Asistente de Aula',
        'Auxiliar de Servicio',
        'Bibliotecario/a CRA',
        'Coordinador/a Académico/a',
        'Coordinador/a de Ciclo',
        'Coordinador/a de Convivencia Escolar',
        'Coordinador/a PIE',
        'Educador/a Diferencial',
        'Educadora de Párvulos',
        'Encargado/a de Convivencia Escolar',
        'Encargado/a de Informática Educativa',
        'Encargado/a de Laboratorio',
        'Encargado/a de Talleres Extraprogramáticos',
        'Fonoaudiólogo/a Educacional',
        'Inspector/a de Patio',
        'Instructor/a de Especialidad TP',
        'Kinesiólogo/a Educacional',
        'Maestro/a Guía de Especialidad',
        'Monitor/a Deportivo/a',
        'Orientador/a Educacional',
        'Paradocente',
        'Profesor/a de Alemán',
        'Profesor/a de Artes Escénicas',
        'Profesor/a de Artes Visuales',
        'Profesor/a de Biología',
        'Profesor/a de Ciencias Naturales',
        'Profesor/a de Educación Básica General',
        'Profesor/a de Educación Física y Salud',
        'Profesor/a de Filosofía',
        'Profesor/a de Física',
        'Profesor/a de Francés',
        'Profesor/a de Historia y Ciencias Sociales',
        'Profesor/a de Inglés',
        'Profesor/a de Lenguaje y Comunicación',
        'Profesor/a de Matemática',
        'Profesor/a de Música',
        'Profesor/a de Química',
        'Profesor/a de Religión',
        'Profesor/a de Tecnología',
        'Profesor/a Técnico Profesional',
        'Psicólogo/a Educacional',
        'Psicopedagogo/a',
        'Terapeuta Ocupacional',
        'Técnico en Educación Especial',
        'Técnico en Educación Parvularia',
        'Trabajador/a Social',
        'Otro (especificar en contacto)'
    ],

    /**
     * Get all communes for a specific region
     */
    getComunasByRegion(regionNombre) {
        const region = this.regions.find(r => r.nombre === regionNombre);
        if (!region) return [];

        const comunas = [];
        region.provincias.forEach(provincia => {
            comunas.push(...provincia.comunas);
        });
        return comunas.sort();
    },

    /**
     * Get all region names
     */
    getRegionNames() {
        return this.regions.map(r => r.nombre);
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChileData;
}
