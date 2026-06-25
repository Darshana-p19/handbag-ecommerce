import React from 'react';
import { motion } from 'framer-motion';
import logoImage from '../assets/logo.jpeg';

function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-playfair font-bold mb-6">Our Story</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Crafting elegance since 2026. We believe every woman deserves to carry her dreams in style.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At HandbagStore, we're passionate about creating beautiful, functional bags that complement your lifestyle. 
                Each piece is thoughtfully designed to combine fashion with practicality.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We source the finest materials and work with skilled artisans to bring you products that are not just accessories, 
                but expressions of your personality.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our commitment to quality and customer satisfaction has made us one of India's most loved handbag brands.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative flex justify-center"
            >
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-primary/30">
                <img
                  src={logoImage}
                  alt="Our Mission"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;