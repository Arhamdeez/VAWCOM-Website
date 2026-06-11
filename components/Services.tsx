'use client';

import ServiceCard from './ServiceCard';
import { Mic, MessageSquare, GitBranch, ChevronRight, Play, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { easeSmooth } from '@/lib/motion';

const DEMO_SWAP = { duration: 0.3, ease: easeSmooth };
import { SiteContainer } from './SiteContainer';

const services = [
	{
		icon: MessageSquare,
		title: 'AI Chatbot Demo',
		description:
			'Smart conversational AI that understands context and provides instant responses. Try our intelligent chatbot for customer support, sales, and engagement.',
		gradient: 'from-green-600 to-emerald-600',
		interactive: true,
		type: 'chatbot',
		image: 'chatbot',
	},
	{
		icon: Mic,
		title: 'Voice Agent Demo',
		description:
			'Experience natural voice interfaces powered by advanced speech recognition. Try a demo voice agent for calls, FAQs, and handoffs to your team.',
		gradient: 'from-teal-600 to-cyan-600',
		interactive: true,
		type: 'voice-agent',
		image: 'voice',
	},
	{
		icon: GitBranch,
		title: 'n8n Workflows Demo',
		description:
			'See how we wire Slack, Gmail, Notion, and more with n8n—integrations and orchestration as part of a broader build.',
		gradient: 'from-emerald-600 to-teal-600',
		interactive: true,
		type: 'n8n-automations',
		image: 'n8n',
	},
];

export default function Services() {
	const [currentCardIndex, setCurrentCardIndex] = useState(0);

	const nextCard = () => {
		setCurrentCardIndex((prev) => (prev + 1) % services.length);
	};

	return (
		<section
			id="services"
			className="relative scroll-mt-[calc(5.25rem+env(safe-area-inset-top,0px))] overflow-hidden pb-10 pt-6 sm:pb-12 sm:pt-10 md:py-20 lg:py-24"
		>
			{/* Mockup: demos sit on a slightly darker navy than #050a14; same grid + soft depth */}
			<div className="pointer-events-none absolute inset-0 bg-[#020508]" aria-hidden />
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_50%_0%,rgba(45,212,191,0.05)_0%,transparent_48%)]"
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_65%_at_50%_105%,rgba(0,0,0,0.45)_0%,transparent_52%)]"
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute inset-0 z-[1] bg-site-zone-grid"
				aria-hidden
			/>
			{/* Soft blend into next section — no hard line (content stays z-10 above this) */}
			<div
				className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[min(12rem,28%)] bg-[linear-gradient(to_bottom,transparent_0%,rgba(5,10,20,0.35)_38%,rgba(5,10,20,0.82)_72%,#050a14_100%)]"
				aria-hidden
			/>
			<SiteContainer>
				<div className="mb-6 text-center md:mb-11">
					<div className="glass-pill mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-emerald-200/95 sm:mb-5 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
						<Sparkles className="h-3.5 w-3.5 shrink-0 opacity-80 sm:h-4 sm:w-4" />
						<span>What we offer</span>
					</div>
					<h2 className="mb-2 text-xl font-semibold tracking-tight text-white sm:mb-3 sm:text-3xl md:mb-4 md:text-4xl">
						Interactive{' '}
						<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
							demos
						</span>
					</h2>
					<p className="mx-auto max-w-md text-sm leading-relaxed text-slate-300 sm:max-w-xl sm:text-base md:text-[17px]">
						Chat, voice, and integrations—try the same kinds of builds we deliver for clients.
					</p>
				</div>

				{/* All demos stay mounted — opacity crossfade avoids remount jank (esp. n8n). */}
				<div className="relative mx-auto w-full max-w-4xl">
					<div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
						{services.map((service, index) => {
							const isCurrent = currentCardIndex === index;
							return (
								<motion.div
									key={service.type}
									initial={false}
									animate={{ opacity: isCurrent ? 1 : 0 }}
									transition={DEMO_SWAP}
									className="w-full [transform:translateZ(0)]"
									style={{ pointerEvents: isCurrent ? 'auto' : 'none' }}
									aria-hidden={!isCurrent}
								>
									<ServiceCard
										{...service}
										currentIndex={index}
										isActive={isCurrent}
									/>
								</motion.div>
							);
						})}
					</div>
				</div>

				<div className="mt-8 flex flex-col items-center gap-4 sm:gap-5">
					<button
						type="button"
						onClick={nextCard}
						className="group btn-glass-muted inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-300 ease-smooth hover:text-white sm:gap-2.5 sm:px-6 sm:py-3 sm:text-[15px]"
					>
						<span>Next demo</span>
						<Play className="w-4 h-4 text-emerald-400/90" />
						<ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 group-hover:text-emerald-400/80 transition-transform duration-300 ease-smooth" />
					</button>

					<div className="flex justify-center gap-2.5">
						{services.map((_, index) => (
							<button
								key={index}
								type="button"
								onClick={() => setCurrentCardIndex(index)}
								className={`h-2 rounded-full transition-all duration-300 ease-smooth ${
									index === currentCardIndex
										? 'w-8 bg-emerald-500/80'
										: 'w-2 bg-slate-700 hover:bg-slate-600'
								}`}
								aria-label={`Show demo ${index + 1}`}
							/>
						))}
					</div>

					<p className="text-slate-600 text-xs tabular-nums">
						{currentCardIndex + 1} / {services.length}
					</p>
				</div>
			</SiteContainer>
		</section>
	);
}
