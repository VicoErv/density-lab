import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { generateTrajectory, getPointsAtTimestep } from '../utils/diffusion';
import { getShapeGenerator } from '../utils/shapes';

const PointCloudDiffusion = () => {
    const [shape, setShape] = useState('circle');
    const [numPoints, setNumPoints] = useState(500);
    const [currentT, setCurrentT] = useState(1000);
    const [isPlaying, setIsPlaying] = useState(false);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // Generate trajectory when shape or numPoints changes
    const trajectory = useMemo(() => {
        const shapeGenerator = getShapeGenerator(shape);
        const targetPoints = shapeGenerator(numPoints);
        return generateTrajectory(targetPoints, 1000, 10);
    }, [shape, numPoints]);

    // Get current points based on timestep
    const currentPoints = useMemo(() => {
        return getPointsAtTimestep(trajectory, currentT);
    }, [trajectory, currentT]);

    // Draw points on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = '#0d0f14';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Transform to center coordinates
        const scale = Math.min(width, height) * 0.35;
        const centerX = width / 2;
        const centerY = height / 2;

        // Color based on timestep (blue at t=1000, target color at t=0)
        const progress = 1 - currentT / 1000;
        const r = Math.floor(59 + (244 - 59) * progress);
        const g = Math.floor(130 + (114 - 130) * progress);
        const b = Math.floor(246 + (182 - 246) * progress);

        // Draw points
        currentPoints.forEach(point => {
            const screenX = centerX + point.x * scale;
            const screenY = centerY - point.y * scale; // Flip Y axis

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, 2, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Draw timestep indicator
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText(`t = ${currentT}`, 20, 30);

    }, [currentPoints, currentT]);

    // Animation loop
    useEffect(() => {
        if (!isPlaying) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            return;
        }

        const animate = () => {
            setCurrentT(t => {
                if (t <= 0) {
                    setIsPlaying(false);
                    return 0;
                }
                return t - 5; // Decrease by 5 per frame
            });
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying]);

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentT(1000);
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            {/* Canvas */}
            <div style={{ height: '400px', position: 'relative', display: 'flex', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
                />
            </div>

            {/* Controls */}
            <div className="controls">
                {/* Shape Selector */}
                <div className="control-group">
                    <label className="control-label">Target Shape</label>
                    <select
                        value={shape}
                        onChange={(e) => {
                            setShape(e.target.value);
                            setCurrentT(1000);
                        }}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--surface-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                        }}
                    >
                        <option value="circle">Circle</option>
                        <option value="spiral">Spiral</option>
                        <option value="multimodal">Multi-Modal (4 Clusters)</option>
                        <option value="moon">Moon</option>
                    </select>
                </div>

                {/* Number of Points */}
                <div className="control-group">
                    <label className="control-label">
                        Number of Points <span className="control-value" style={{ color: '#f472b6' }}>{numPoints}</span>
                    </label>
                    <input
                        type="range"
                        min="100"
                        max="1000"
                        step="50"
                        value={numPoints}
                        onChange={(e) => {
                            setNumPoints(parseInt(e.target.value));
                            setCurrentT(1000);
                        }}
                        style={{ accentColor: '#f472b6' }}
                    />
                </div>

                {/* Timestep Slider */}
                <div className="control-group">
                    <label className="control-label">
                        Diffusion Timestep <span className="control-value" style={{ color: '#3b82f6' }}>{currentT}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={currentT}
                        onChange={(e) => setCurrentT(parseInt(e.target.value))}
                        style={{ accentColor: '#3b82f6' }}
                    />
                </div>

                {/* Animation Controls */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                        onClick={handlePlayPause}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            background: isPlaying ? 'var(--accent-warning)' : 'var(--accent-primary)',
                            border: 'none',
                            borderRadius: '0.5rem',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Play Reverse Diffusion</>}
                    </button>
                    <button
                        onClick={handleReset}
                        style={{
                            padding: '0.75rem',
                            background: 'var(--surface-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>

                {/* Info Box */}
                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    marginTop: '0.5rem'
                }}>
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600, marginBottom: '0.3rem' }}>
                        Forward Diffusion Process
                    </div>
                    <div
                        style={{ fontSize: '0.75rem', opacity: 0.8 }}
                        ref={(el) => {
                            if (el && window.katex) {
                                window.katex.render(
                                    `x_t = \\sqrt{\\bar{\\alpha}_t} \\cdot x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\cdot \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, I)`,
                                    el,
                                    { throwOnError: false }
                                );
                            }
                        }}
                    />
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                        Watch points evolve from structured data (t=0) to pure Gaussian noise (t=1000)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PointCloudDiffusion;
