import React, { useState, useEffect, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const SamplingConvergence = () => {
    const [samples, setSamples] = useState([]);
    const [isSampling, setIsSampling] = useState(false);
    const mu = 0;
    const sigma = 1;

    const binSize = 0.5;
    const bins = useMemo(() => {
        const b = {};
        for (let i = -5; i <= 5; i += binSize) {
            b[i.toFixed(1)] = 0;
        }
        return b;
    }, []);

    const generateSample = () => {
        // Box-Muller transform
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * sigma + mu;
    };

    useEffect(() => {
        let interval;
        if (isSampling) {
            interval = setInterval(() => {
                setSamples(prev => [...prev, generateSample()]);
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isSampling]);

    const chartData = useMemo(() => {
        const histData = { ...bins };
        samples.forEach(s => {
            const b = Math.floor(s / binSize) * binSize;
            const key = b.toFixed(1);
            if (histData.hasOwnProperty(key)) {
                histData[key]++;
            }
        });

        const labels = Object.keys(histData).sort((a, b) => parseFloat(a) - parseFloat(b));
        const histogramValues = labels.map(l => histData[l] / (samples.length * binSize || 1));

        const densityValues = labels.map(l => {
            const x = parseFloat(l) + binSize / 2;
            const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
            return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
        });

        return {
            labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Histogram (Normalized)',
                    data: histogramValues,
                    backgroundColor: 'rgba(6, 182, 212, 0.4)',
                    borderColor: '#06b6d4',
                    borderWidth: 1,
                    categoryPercentage: 1.0,
                    barPercentage: 0.9,
                },
                {
                    type: 'line',
                    label: 'True Density p(x)',
                    data: densityValues,
                    borderColor: '#e2e8f0',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.4
                }
            ],
        };
    }, [samples]);

    return (
        <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <ReactChart type='bar' data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { min: 0, max: 0.6, ticks: { color: '#94a3b8' } },
                        x: { ticks: { color: '#94a3b8' } }
                    }
                }} />
            </div>
            <div className="controls" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                    onClick={() => setIsSampling(!isSampling)}
                    style={{ flex: 1 }}
                >
                    {isSampling ? 'Stop Sampling' : 'Start Sampling'}
                </button>
                <button
                    className="secondary"
                    onClick={() => { setSamples([]); setIsSampling(false); }}
                >
                    Reset
                </button>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minWidth: '60px' }}>
                    N = {samples.length}
                </div>
            </div>
        </div>
    );
};

export default SamplingConvergence;
