import React, {useState} from 'react'
import Wrapper from '../assets/wrappers/ChartsContainer.js'
import { useAppContext } from '../context/appContext'
import AreasChart from './AreaChart'
import BarsChart from './BarChart'


const ChartsContainer = () => {

  const [barChart, setBarChart] = useState(true)
  const  {monthlyApplications:data} = useAppContext()
  return (
    <Wrapper>
      <h4>Monthly Applications</h4>

      <button 
        type='button' 
        onClick={() => {
          setBarChart(!barChart)
        }}>
          {barChart ? 'Area Chart' : 'Bar Chart'}
      </button>

      { barChart ? <BarsChart data={data}/> :
      <AreasChart data={data}/>}
    </Wrapper>
  )
}

export default ChartsContainer