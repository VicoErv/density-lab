import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    LineController,
    ScatterController
} from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    LineController,
    ScatterController
);

const DenoisingScoreMatching = () => {
    const [cleanX, setCleanX] = useState(0);
    const [sigma, setSigma] = useState(1.0);
    const [noisyX, setNoisyX] = useState(1.5);
    const [modelTheta, setModelTheta] = useState(0.8); // Simple model scale theta

    // Target score: - (xtilde - x) / sigma^2
    const targetScore = useMemo(() => {
        return -(noisyX - cleanX) / Math.pow(sigma, 2);
    }, [noisyX, cleanX, sigma]);

    // Model score: simple linear model psi(xtilde) = -theta * (xtilde - cleanX)
    // In practice cleanX is hidden, but for visualization we show how a model tries to guess it
    const modelScore = useMemo(() => {
        return -modelTheta * (noisyX - cleanX) / Math.pow(sigma, 2);
    }, [noisyX, cleanX, sigma, modelTheta]);

    const chartData = useMemo(() => {
        const labels = [];
        const kernelValues = [];

        // Visualize the noise kernel q(xtilde | x)
        for (let x = -5; x <= 5; x += 0.1) {
            labels.push(x.toFixed(1));
            const dens = (1 / (sigma * Math.sqrt(2 * Math.PI))) *
                Math.exp(-Math.pow(x - cleanX, 2) / (2 * Math.pow(sigma, 2)));
            kernelValues.push(dens);
        }

        return {
            labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Noise Kernel q(x̃|x)',
                    data: kernelValues,
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    pointRadius: 0,
                    tension: 0.4
                },
                {
                    type: 'scatter',
                    label: 'Clean Data x',
                    data: [{ x: cleanX.toFixed(1), y: 0 }],
                    backgroundColor: '#ffffff',
                    pointRadius: 6,
                    pointStyle: 'rectRot'
                },
                {
                    type: 'scatter',
                    label: 'Noisy Sample x̃',
                    data: [{ x: noisyX.toFixed(1), y: 0 }],
                    backgroundColor: '#f472b6',
                    pointRadius: 8
                }
            ]
        };
    }, [cleanX, sigma, noisyX]);

    const dsmLoss = 0.5 * Math.pow(modelScore - targetScore, 2);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            <div style={{ height: '220px', position: 'relative', flexShrink: 0 }}>
                <ReactChart type='line' data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { color: '#94a3b8', boxWidth: 10, font: { size: 10 } } } },
                    scales: {
                        y: { min: -0.1, max: 1.0, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false } },
                        x: { ticks: { color: '#94a3b8' } }
                    }
                }} />

                {/* Visualizing the vectors (Target vs Model) */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0',
                    right: '0',
                    height: '100px',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {/* Target Vector (points to mode) */}
                    <div style={{
                        position: 'absolute',
                        left: `${(noisyX + 5) * 10}%`,
                        width: `${Math.abs(targetScore) * 20}px`,
                        height: '4px',
                        background: '#ffffff',
                        opacity: 0.8,
                        transformOrigin: 'left',
                        transform: `scaleX(${targetScore > 0 ? 1 : -1})`,
                        borderRadius: '2px'
                    }}>
                        <div style={{ position: 'absolute', right: '-4px', top: '-3px', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #ffffff' }} />
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '0',
                            color: '#ffffff',
                            fontSize: '0.6rem',
                            whiteSpace: 'nowrap',
                            transform: `scaleX(${targetScore > 0 ? 1 : -1})`,
                            transformOrigin: 'left'
                        }}>Target Score</div>
                    </div>

                    {/* Model Prediction */}
                    <div style={{
                        position: 'absolute',
                        left: `${(noisyX + 5) * 10}%`,
                        top: '60px',
                        width: `${Math.abs(modelScore) * 20}px`,
                        height: '4px',
                        background: '#f472b6',
                        transformOrigin: 'left',
                        transform: `scaleX(${modelScore > 0 ? 1 : -1})`,
                        borderRadius: '2px'
                    }}>
                        <div style={{ position: 'absolute', right: '-4px', top: '-3px', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #f472b6' }} />
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '0',
                            color: '#f472b6',
                            fontSize: '0.6rem',
                            whiteSpace: 'nowrap',
                            transform: `scaleX(${modelScore > 0 ? 1 : -1})`,
                            transformOrigin: 'left'
                        }}>Model Prediction ψ(x̃)</div>
                    </div>
                </div>
            </div>

            <div className="controls" style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="control-group" style={{ margin: 0 }}>
                        <label className="control-label" style={{ fontSize: '0.7rem' }}>x (Clean) <span className="control-value">{cleanX.toFixed(1)}</span></label>
                        <input type="range" min="-3" max="3" step="0.1" value={cleanX} onChange={(e) => setCleanX(parseFloat(e.target.value))} />
                    </div>
                    <div className="control-group" style={{ margin: 0 }}>
                        <label className="control-label" style={{ fontSize: '0.7rem' }}>σ (Noise) <span className="control-value">{sigma.toFixed(2)}</span></label>
                        <input type="range" min="0.5" max="2" step="0.05" value={sigma} onChange={(e) => setSigma(parseFloat(e.target.value))} />
                    </div>
                </div>

                <div className="control-group">
                    <label className="control-label" style={{ color: '#f472b6', fontWeight: 600 }}>Noisy Sample (x̃) <span className="control-value">{noisyX.toFixed(2)}</span></label>
                    <input type="range" min="-4" max="4" step="0.05" value={noisyX} onChange={(e) => setNoisyX(parseFloat(e.target.value))} style={{ accentColor: '#f472b6' }} />
                </div>

                <div style={{
                    background: 'rgba(244, 114, 182, 0.05)',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(244, 114, 182, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <div
                        style={{ fontSize: '0.75rem', opacity: 0.6 }}
                        ref={(el) => {
                            if (el && window.katex) {
                                window.katex.render(
                                    `J = \\mathbb{E}_{q_\\sigma} [ \\frac{1}{2} \\| \\psi(\\tilde{x};\\theta) - \\nabla \\log q_\\sigma(\\tilde{x}|x) \\|^2 ]`,
                                    el,
                                    { throwOnError: false }
                                );
                            }
                        }}
                    />
                    <div
                        style={{ fontSize: '0.85rem' }}
                        ref={(el) => {
                            if (el && window.katex) {
                                window.katex.render(
                                    `J = \\frac{1}{2} \\| ${modelScore.toFixed(2)} - (${targetScore.toFixed(2)}) \\|^2 = ${dsmLoss.toFixed(4)}`,
                                    el,
                                    { throwOnError: false }
                                );
                            }
                        }}
                    />
                    <div className="control-group" style={{ width: '100%', margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="control-label" style={{ margin: 0 }}>Model θ <span className="control-value" style={{ color: '#f472b6' }}>{modelTheta.toFixed(2)}</span></label>
                        </div>
                        <input type="range" min="0" max="2" step="0.01" value={modelTheta} onChange={(e) => setModelTheta(parseFloat(e.target.value))} style={{ accentColor: '#f472b6' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DenoisingScoreMatching;
