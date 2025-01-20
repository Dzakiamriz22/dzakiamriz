import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import Contact from '@/components/Contact';
import Experience from '@/components/Experience';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Experience/>
      <Projects />
      <Contact/>
      <Footer />
    </div>
  );
};

export default Home;