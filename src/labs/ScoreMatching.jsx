import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ScoreMatching = () => {
    const [point, setPoint] = useState(2.0);
    const [sigma, setSigma] = useState(1.0);
    const mu = 0;

    const score = useMemo(() => {
        // s(x) = - (x - mu) / sigma^2
        return -(point - mu) / Math.pow(sigma, 2);
    }, [point, sigma]);

    const chartData = useMemo(() => {
        const labels = [];
        const densityValues = [];
        const scoreValues = [];

        for (let x = -5; x <= 5; x += 0.2) {
            labels.push(x.toFixed(1));

            // Density
            const dens = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)));
            densityValues.push(dens);

            // Score: s(x) = -(x-mu)/sigma^2
            const s = -(x - mu) / Math.pow(sigma, 2);
            scoreValues.push(s);
        }

        return {
            labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Score Field ∇log p(x)',
                    data: scoreValues,
                    borderColor: '#f472b6',
                    borderWidth: 2,
                    pointRadius: 0,
                    yAxisID: 'yScore',
                },
                {
                    type: 'line',
                    label: 'Density p(x)',
                    data: densityValues,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    yAxisID: 'yDensity',
                }
            ],
        };
    }, [sigma]);

    // Vector arrows visualization
    const renderVectors = () => {
        const vectors = [];
        for (let x = -4; x <= 4; x += 1) {
            const s = -(x - mu) / Math.pow(sigma, 2);
            const length = Math.abs(s) * 15;
            const direction = s > 0 ? 1 : -1;
            vectors.push(
                <div key={x} style={{
                    position: 'absolute',
                    left: `${(x + 5) * 10}%`,
                    bottom: '20px',
                    height: '2px',
                    width: `${length}px`,
                    background: '#f472b6',
                    transform: `translateX(${direction === -1 ? -length : 0}px)`,
                    opacity: 0.6,
                    transition: 'all 0.2s ease'
                }}>
                    <div style={{
                        position: 'absolute',
                        right: direction === 1 ? '0' : 'auto',
                        left: direction === -1 ? '0' : 'auto',
                        top: '-3px',
                        borderTop: '4px solid transparent',
                        borderBottom: '4px solid transparent',
                        [direction === 1 ? 'borderLeft' : 'borderRight']: '6px solid #f472b6'
                    }} />
                </div>
            );
        }
        return vectors;
    };

    return (
        <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <ReactChart type='line' data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        yScore: {
                            type: 'linear', position: 'left',
                            ticks: { color: '#f472b6' },
                            grid: { color: 'rgba(244, 114, 182, 0.1)' },
                            title: { display: true, text: 'Score', color: '#f472b6' }
                        },
                        yDensity: {
                            type: 'linear', position: 'right',
                            display: false,
                            min: 0, max: 1
                        },
                        x: { ticks: { color: '#94a3b8' } }
                    }
                }} />
                {renderVectors()}
            </div>

            <div className="controls" style={{ marginTop: '1rem' }}>
                <div className="control-group">
                    <label className="control-label">
                        Observed x <span className="control-value" style={{ color: '#f472b6' }}>{point.toFixed(2)}</span>
                    </label>
                    <input
                        type="range" min="-4" max="4" step="0.05" value={point}
                        onChange={(e) => setPoint(parseFloat(e.target.value))}
                        style={{ accentColor: '#f472b6' }}
                    />
                </div>
                <div className="control-group">
                    <label className="control-label">
                        Noise Scale (σ) <span className="control-value">{sigma.toFixed(2)}</span>
                    </label>
                    <input
                        type="range" min="0.5" max="2" step="0.05" value={sigma}
                        onChange={(e) => setSigma(parseFloat(e.target.value))}
                    />
                </div>
                <div style={{
                    background: 'rgba(244, 114, 182, 0.1)',
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                    color: '#f472b6',
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>
                    Score s(x) = ∇ log p(x) = {(score).toFixed(3)}
                    <div style={{ fontWeight: 'normal', opacity: 0.8, fontSize: '0.7rem' }}>
                        Points toward the data mode!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreMatching;
