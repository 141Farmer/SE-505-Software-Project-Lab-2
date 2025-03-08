import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/HeroSection';
import Features from '../../components/Features/FeaturesSection';
import ContractSection from '../../components/ContractSection';
import Stats from '../../components/States/StatsSection';
import Footer from '../../components/Footer';
import { 
  ChevronRight, 
  ShoppingCart, 
  Users, 
  PiggyBank, 
  Leaf, 
  MessageSquare, 
  DollarSign,
  Menu,
  X
} from 'lucide-react';

// Features Data
const featureData = [
  {
    id: 'market',
    icon: ShoppingCart,
    title: 'Agricultural Marketplace',
    description: 'Buy and sell agricultural products directly. From seeds to machinery, find everything you need for your farm.',
    features: [
      'Direct farmer-to-buyer transactions',
      'Quality verified products',
      'Secure payment system'
    ]
  },
  {
    id: 'invest',
    icon: PiggyBank,
    title: 'Investment Forum',
    description: 'Connect with investors or find agricultural projects to invest in. Grow your agricultural business.',
    features: [
      'Investment opportunities',
      'Project funding',
      'Financial advisory'
    ]
  },
  {
    id: 'community',
    icon: MessageSquare,
    title: 'Community Forum',
    description: 'Share knowledge, ask questions, and connect with other agriculture professionals in our vibrant community.',
    features: [
      'Expert discussions',
      'Knowledge sharing',
      'Regional farming groups'
    ]
  }
];

// Stats Data
const statsData = [
  { icon: Users, value: '10K+', label: 'Active Members' },
  { icon: ShoppingCart, value: '50K+', label: 'Products Listed' },
  { icon: DollarSign, value: '1M+', label: 'In Investments' }
];

// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <Hero />
      <main className="container mx-auto px-6 py-16">
        <Features featureData={featureData} />
        <ContractSection/>
      </main>
      {/* <Stats statsData={statsData} /> */}
      <Footer />
    </div>
  );
};

export default LandingPage;