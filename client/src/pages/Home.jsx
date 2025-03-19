
import BackToTop from '@/components/BackToTop'
import { Hero } from '../components/Hero'
import PropTypes from 'prop-types'



export const Home = ({ onGetStarted }) => {
    
  return <div>
    <Hero onGetStarted={onGetStarted} />

  </div> 
}

Home.propTypes = {
  onGetStarted: PropTypes.func.isRequired
}