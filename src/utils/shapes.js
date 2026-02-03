/**
 * Target shape generators for 2D point cloud diffusion
 */

/**
 * Generate points uniformly distributed on a circle
 * @param {number} n - Number of points
 * @param {number} radius - Circle radius
 * @param {number} noise - Amount of radial noise to add
 * @returns {Array<{x: number, y: number}>}
 */
export function generateCircle(n = 500, radius = 1.0, noise = 0.02) {
    const points = [];
    for (let i = 0; i < n; i++) {
        const theta = (2 * Math.PI * i) / n;
        const r = radius + (Math.random() - 0.5) * noise;
        points.push({
            x: r * Math.cos(theta),
            y: r * Math.sin(theta)
        });
    }
    return points;
}

/**
 * Generate points along an Archimedean spiral
 * @param {number} n - Number of points
 * @param {number} turns - Number of spiral turns
 * @param {number} spacing - Spacing between turns
 * @returns {Array<{x: number, y: number}>}
 */
export function generateSpiral(n = 500, turns = 3, spacing = 0.15) {
    const points = [];
    for (let i = 0; i < n; i++) {
        const t = (turns * 2 * Math.PI * i) / n;
        const r = spacing * t;
        points.push({
            x: r * Math.cos(t),
            y: r * Math.sin(t)
        });
    }
    return points;
}

/**
 * Generate multi-modal distribution (multiple Gaussian clusters)
 * @param {number} n - Total number of points
 * @param {Array<{x: number, y: number}>} centers - Cluster centers
 * @param {number} std - Standard deviation of each cluster
 * @returns {Array<{x: number, y: number}>}
 */
export function generateMultiModal(n = 500, centers = [
    { x: 0.6, y: 0.6 },
    { x: -0.6, y: 0.6 },
    { x: 0.6, y: -0.6 },
    { x: -0.6, y: -0.6 }
], std = 0.15) {
    const points = [];
    const pointsPerCluster = Math.floor(n / centers.length);

    for (const center of centers) {
        for (let i = 0; i < pointsPerCluster; i++) {
            points.push({
                x: center.x + gaussianRandom() * std,
                y: center.y + gaussianRandom() * std
            });
        }
    }

    // Add remaining points to first cluster
    const remaining = n - points.length;
    for (let i = 0; i < remaining; i++) {
        points.push({
            x: centers[0].x + gaussianRandom() * std,
            y: centers[0].y + gaussianRandom() * std
        });
    }

    return points;
}

/**
 * Generate points in the shape of a moon (crescent)
 * @param {number} n - Number of points
 * @param {number} radius - Outer radius
 * @returns {Array<{x: number, y: number}>}
 */
export function generateMoon(n = 500, radius = 1.0) {
    const points = [];
    for (let i = 0; i < n; i++) {
        const theta = Math.PI * (0.5 + Math.random());
        const r = radius * (0.7 + 0.3 * Math.random());
        points.push({
            x: r * Math.cos(theta) - 0.2,
            y: r * Math.sin(theta)
        });
    }
    return points;
}

/**
 * Box-Muller transform for Gaussian random numbers
 */
function gaussianRandom() {
    let u1 = 0, u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

/**
 * Get shape generator by name
 * @param {string} shapeName - Name of the shape
 * @returns {Function} Shape generator function
 */
export function getShapeGenerator(shapeName) {
    const generators = {
        circle: generateCircle,
        spiral: generateSpiral,
        multimodal: generateMultiModal,
        moon: generateMoon
    };
    return generators[shapeName] || generateCircle;
}
