import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Check, Zap, Crown, Rocket } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  popular?: boolean;
  depth: number;
  index: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period,
  description,
  features,
  icon: Icon,
  popular = false,
  depth,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="pricing-card"
      style={{
        transformStyle: 'preserve-3d',
        translateZ: depth,
      }}
      initial={{ opacity: 0, rotateY: 90 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={`floating-card h-full p-8 flex flex-col relative ${
          popular ? 'border-emerald-500/30' : ''
        }`}
        style={{
          rotateX,
          rotateY,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Popular badge */}
        {popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="px-4 py-1.5 bg-emerald-500 rounded-full text-xs font-semibold text-white shadow-lg shadow-emerald-500/30">
              Most Popular
            </div>
          </div>
        )}

        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-xl ${
            popular ? 'bg-emerald-500/20' : 'bg-neutral-800'
          } flex items-center justify-center mb-6`}
        >
          <Icon
            className={`w-7 h-7 ${popular ? 'text-emerald-400' : 'text-stone-400'}`}
          />
        </div>

        {/* Plan name */}
        <h3 className="text-xl font-bold text-stone-100 mb-2">{name}</h3>
        <p className="text-sm text-stone-500 mb-6">{description}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-4xl md:text-5xl font-bold text-stone-100">
            {price}
          </span>
          <span className="text-stone-500">{period}</span>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  popular ? 'text-emerald-400' : 'text-stone-500'
                }`}
              />
              <span className="text-sm text-stone-300">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
            popular
              ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
              : 'bg-stone-800 text-stone-100 hover:bg-stone-700 border border-stone-700'
          }`}
        >
          Get Started
        </button>
      </motion.div>
    </motion.div>
  );
};

const Pricing: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for solo coaches just getting started.',
      icon: Rocket,
      features: [
        'Up to 10 active clients',
        'Basic analytics dashboard',
        'Program builder',
        'Email support',
        'Mobile app access',
      ],
      depth: 40,
    },
    {
      name: 'Pro',
      price: '$79',
      period: '/month',
      description: 'For serious coaches ready to scale.',
      icon: Zap,
      popular: true,
      features: [
        'Unlimited clients',
        'Advanced analytics & AI insights',
        'White-label branding',
        'Priority support',
        'API access',
        'Team collaboration',
      ],
      depth: 80,
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For gyms and coaching organizations.',
      icon: Crown,
      features: [
        'Everything in Pro',
        'Multiple coach accounts',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'Onboarding training',
      ],
      depth: 40,
    },
   ];

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative w-full bg-neutral-950 py-32"
    >
      {/* Background glows */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[150px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full section-padding">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/60 border border-stone-800 mb-6"
          >
            <Crown className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
              Pricing
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 mb-6"
          >
            Simple pricing.
            <br />
            <span className="text-gradient-emerald">Serious results.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-stone-400 leading-relaxed"
          >
            Start free for 14 days. No credit card required. Cancel anytime.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="perspective-container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <PricingCard key={plan.name} {...plan} index={index} />
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16 text-stone-500 text-sm"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
