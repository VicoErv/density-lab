import React, { useState, useRef, useEffect } from 'react';

const Multivariate2D = () => {
    const [rho, setRho] = useState(0.5); // Correlation
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 40;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = -5; i <= 5; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX + i * scale, 0);
            ctx.lineTo(centerX + i * scale, height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, centerY + i * scale);
            ctx.lineTo(width, centerY + i * scale);
            ctx.stroke();
        }

        // Covariance matrix Σ = [[1, rho], [rho, 1]]
        // Eigenvalues and Eigenvectors for the ellipse
        // lambda1 = 1 + rho, lambda2 = 1 - rho
        // v1 = [1, 1], v2 = [1, -1]
        const lambda1 = 1 + rho;
        const lambda2 = 1 - rho;
        const angle = Math.PI / 4; // 45 degrees since sigmaX = sigmaY = 1

        const drawEllipse = (sigmaMultiplier, color, alpha) => {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);

            const rx = Math.sqrt(lambda1) * scale * sigmaMultiplier;
            const ry = Math.sqrt(lambda2) * scale * sigmaMultiplier;

            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry, 0, 0, 2 * Math.PI);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = `rgba(${color.match(/\d+/g).join(',')}, ${alpha})`;
            ctx.fill();
            ctx.restore();
        };

        // Draw probability contours (1σ, 2σ, 3σ)
        drawEllipse(3, 'rgba(168, 85, 247, 0.5)', 0.05);
        drawEllipse(2, 'rgba(168, 85, 247, 0.8)', 0.1);
        drawEllipse(1, 'rgba(168, 85, 247, 1.0)', 0.2);

        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
        ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
        ctx.stroke();

    }, [rho]);

    return (
        <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
                />
            </div>
            <div className="controls" style={{ marginTop: '1rem' }}>
                <div className="control-group">
                    <label className="control-label">
                        Correlation (ρ) <span className="control-value">{rho.toFixed(2)}</span>
                    </label>
                    <input
                        type="range" min="-0.95" max="0.95" step="0.05" value={rho}
                        onChange={(e) => setRho(parseFloat(e.target.value))}
                        style={{ accentColor: '#a855f7' }}
                    />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    Σ = [[1, {rho.toFixed(2)}], [{rho.toFixed(2)}, 1]]
                </div>
            </div>
        </div>
    );
};

export default Multivariate2D;
