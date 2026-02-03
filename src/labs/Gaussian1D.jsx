import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const Gaussian1D = () => {
    const [mu, setMu] = useState(0);
    const [sigma, setSigma] = useState(1);

    const data = useMemo(() => {
        const labels = [];
        const values = [];

        // Range from -5 to 5
        for (let x = -7; x <= 7; x += 0.1) {
            labels.push(x.toFixed(1));
            const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
            const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
            values.push(y);
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Density p(x)',
                    data: values,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                },
            ],
        };
    }, [mu, sigma]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', maxTicksLimit: 7 }
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#94a3b8' },
                min: 0,
                max: 1.2
            }
        },
        animation: {
            duration: 200
        }
    };

    return (
        <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <Line data={data} options={options} />
            </div>
            <div className="controls" style={{ marginTop: '1rem' }}>
                <div className="control-group">
                    <label className="control-label">
                        μ (Mean) <span className="control-value">{mu.toFixed(1)}</span>
                    </label>
                    <input
                        type="range" min="-5" max="5" step="0.1" value={mu}
                        onChange={(e) => setMu(parseFloat(e.target.value))}
                    />
                </div>
                <div className="control-group">
                    <label className="control-label">
                        σ (Sigma) <span className="control-value">{sigma.toFixed(2)}</span>
                    </label>
                    <input
                        type="range" min="0.3" max="3" step="0.05" value={sigma}
                        onChange={(e) => setSigma(parseFloat(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
};

export default Gaussian1D;
