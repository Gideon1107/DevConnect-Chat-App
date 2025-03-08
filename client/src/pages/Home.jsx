// File: Home.jsx
import { Hero } from '../components/Hero'



export const Home = ({ onGetStarted }) => {

    const scrollToTop = () => {
      window
        .scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    scrollToTop()
    
  return <Hero onGetStarted={onGetStarted} />
}