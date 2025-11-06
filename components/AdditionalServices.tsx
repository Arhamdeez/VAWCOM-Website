'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Code, Smartphone, Globe, Database, Cloud, Shield } from 'lucide-react';

const additionalServices = [
  {
    icon: Code,
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Smartphone,
    title: 'App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Globe,
    title: 'E-commerce Solutions',
    description: 'Complete online stores with payment integration and inventory management',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Code,
    title: 'Website Maintenance',
    description: 'Keep your website running smoothly with regular updates and monitoring',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Shield,
    title: 'Bug Fixing',
    description: 'Quick resolution of technical issues and performance problems',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    icon: Code,
    title: 'Code Cleanup',
    description: 'Fix messy code, improve performance, and clean up technical debt',
    gradient: 'from-yellow-500 to-orange-500'
  }
];

export default function AdditionalServices() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-8 backdrop-blur-sm">
            <span className="font-medium">And Much More</span>
          </div>
          
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Seamless
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Integrations & Workflows
            </span>
          </h2>
          
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Custom workflows tailored to your exact process. Connect all your apps with n8n—Slack, Gmail, Notion, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {additionalServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative p-6 rounded-2xl bg-slate-900/95 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:bg-slate-900/95 backdrop-blur-xl">
                {/* Subtle glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${service.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-white text-sm font-semibold mb-2 group-hover:text-slate-200 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300 transition-colors">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-slate-300 text-lg mb-8">
            Ready to automate your business? Let's connect your systems and make your workflows run on autopilot.
          </p>
          
          <div className="flex justify-center">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
