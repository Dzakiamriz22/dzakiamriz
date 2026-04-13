import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import Contact from '@/components/Contact';
import Experience from '@/components/Experience';
import GitHubOverview from '@/components/GitHubOverview';
import BlogTeaser from '@/components/BlogTeaser';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <GitHubOverview />
      <Contact />
      <BlogTeaser />
      <Footer />
    </div>
  );
};

export default Home;