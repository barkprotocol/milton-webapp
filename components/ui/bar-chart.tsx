import React from 'react'
import { Bar } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartOptions
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Define the correct type for the chart options
const options: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const, // Use 'as const' to specify the literal type
    },
    title: {
      display: true,
      text: 'Chart Title',
    },
  },
}

// Milton data object
const data = {
  labels: ['Label 1', 'Label 2', 'Label 3'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [10, 20, 30],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [15, 25, 35],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

export function BarChart() {
  return <Bar options={options} data={data} />
}