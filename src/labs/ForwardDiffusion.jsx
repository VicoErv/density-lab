import React, { useState, useRef, useEffect } from 'react';

const ForwardDiffusion = () => {
    const [sigma, setSigma] = useState(0);
    const canvasRef = useRef(null);
    const baseDataRef = useRef(null);

    // Box-Muller for Gaussian Noise
    const gaussianRandom = () => {
        let u1 = 0, u2 = 0;
        while (u1 === 0) u1 = Math.random();
        while (u2 === 0) u2 = Math.random();
        return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    };

    // Initialize base "data manifold" (complex colorful pattern)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Create a beautiful base pattern
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(0.5, '#f472b6');
        gradient.addColorStop(1, '#06b6d4');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add some geometric "data"
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(width * Math.random(), height * Math.random(), 30, 0, Math.PI * 2);
            ctx.stroke();
        }

        baseDataRef.current = ctx.getImageData(0, 0, width, height);
    }, []);

    // Apply noise in real-time
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !baseDataRef.current) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const output = ctx.createImageData(width, height);
        const base = baseDataRef.current.data;
        const data = output.data;

        for (let i = 0; i < base.length; i += 4) {
            const noise = gaussianRandom() * sigma;
            data[i] = Math.min(255, Math.max(0, base[i] + noise));     // R
            data[i + 1] = Math.min(255, Math.max(0, base[i + 1] + noise)); // G
            data[i + 2] = Math.min(255, Math.max(0, base[i + 2] + noise)); // B
            data[i + 3] = 255;                                          // A
        }

        ctx.putImageData(output, 0, 0);
    }, [sigma]);

    return (
        <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    style={{ width: '100%', height: '100%', borderRadius: '1rem', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                />
            </div>
            <div className="controls" style={{ marginTop: '1rem' }}>
                <div className="control-group">
                    <label className="control-label">
                        Diffusion Noise (σ) <span className="control-value" style={{ color: '#06b6d4' }}>{sigma.toFixed(0)}</span>
                    </label>
                    <input
                        type="range" min="0" max="250" step="1" value={sigma}
                        onChange={(e) => setSigma(parseFloat(e.target.value))}
                        style={{ accentColor: '#06b6d4' }}
                    />
                </div>
                <div style={{
                    background: 'rgba(6, 182, 212, 0.1)',
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                    color: '#06b6d4',
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>
                    {sigma < 50 ? "Structured Data" : sigma < 150 ? "Corrupted Manifold" : "Pure Gaussian Noise"}
                    <div style={{ fontWeight: 'normal', opacity: 0.8, fontSize: '0.7rem' }}>
                        {"$x_t = x_0 + \\epsilon, \\epsilon \\sim \\mathcal{N}(0, \\sigma^2 I)$"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForwardDiffusion;
