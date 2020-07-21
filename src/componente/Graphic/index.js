import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

const Graphic = props => {
  const { titleGraphic, type, color, data, label=[]} = props // titleGraphic = titulo del grafico, type = tipo de grafico (bar, line, horizontalBar, radar, bubble, scatteretc), color de la linea, data array de datos, label 

  const [chartConfig, setChartConfig] = useState(null)
  const options = {
    responsive: true,
    steppedLine: true
  }

  useEffect(() => {
    setChartConfig({
      labels: label,
      datasets:[{
            label: titleGraphic,
            type: type,
            fill: false,
            lineTension: 0.4,
            backgroundColor: color,
            borderColor:  color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor:  color,
            pointBackgroundColor:  color,
            pointRadius: 4,
            pointHoverRadius: 5,
            pointHitRadius: 4,
            pointBorderWidth: 1,
            pointHoverBackgroundColor:  color,
            pointHoverBorderColor:  color,
            pointHoverBorderWidth: 2,
            data: data
          }]
    })
  }, [data, label] )


  return <Bar data={chartConfig} options={options} />
}

export default Graphic