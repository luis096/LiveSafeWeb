import React from 'react'
import Graphic from '../Graphic'

const Reports = (props) => {
  const data = [ 5,  8, 1,  3,  8,  5, 15, 7, 10,  8, 11,  7]
  const label = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

  return(
    <div className="graphic">
      
          <Graphic 
            label={label} data= {data} color='#ff00aa' titleGraphic='Prueba' type='line'
          />
        
    </div>
  )
}
export default Reports