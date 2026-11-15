import React from 'react';

import '../styles/landing.css';

import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import ProductPreview from '../components/landing/ProductPreview';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Benefits from '../components/landing/Benefits';
import CallToAction from '../components/landing/CallToAction';
import Footer from '../components/landing/Footer';

function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <ProductPreview />
        <Features />
        <HowItWorks />
        <Benefits />
        <CallToAction />
      </main>

      <Footer />
    </>
  );
}

export default LandingPage;