'use client';

import ServiceCard from './ServiceCard';
import { Mic, MessageSquare, GitBranch, ChevronRight, Play, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const services = [
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

	const current = services[currentCardIndex];

	return (
		<section id="services" className="relative overflow-hidden bg-slate-950 py-12 md:py-20 lg:py-24">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f06_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f06_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem]" />
			<div className="container relative z-10 mx-auto max-w-5xl pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6 lg:px-8">
				<div className="mb-8 text-center md:mb-11">
					<div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/18 bg-slate-950/40 px-3 py-1.5 text-xs text-emerald-200/90 backdrop-blur-sm sm:mb-5 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
						<Sparkles className="h-3.5 w-3.5 shrink-0 opacity-80 sm:h-4 sm:w-4" />
						<span>What we offer</span>
					</div>
					<h2 className="mb-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:mb-4 md:text-4xl">
						Interactive{' '}
						<span className="bg-gradient-to-r from-emerald-400/85 to-teal-400/85 bg-clip-text text-transparent">
							demos
						</span>
					</h2>
					<p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base md:text-[17px]">
						Voice, chat, and integrations—try the same kinds of builds we deliver for clients.
					</p>
				</div>

				{/* Single card + crossfade — avoids stacked “peek” layer fighting transitions */}
				<div className="relative mb-10 min-h-[min(520px,78svh)] w-full sm:min-h-[540px] md:mb-14 md:min-h-[600px]">
					<AnimatePresence initial={false} mode="wait">
						<motion.div
							key={currentCardIndex}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -6 }}
							transition={{
								duration: 0.22,
								ease: [0.4, 0, 0.2, 1],
							}}
							className="absolute inset-0 w-full"
						>
							<ServiceCard
								{...current}
								currentIndex={currentCardIndex}
								isActive
							/>
						</motion.div>
					</AnimatePresence>
				</div>

				<div className="flex flex-col items-center gap-5 pt-1 sm:gap-6 sm:pt-2">
					<button
						type="button"
						onClick={nextCard}
						className="group btn-glass-muted inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-150 hover:text-white sm:gap-2.5 sm:px-6 sm:py-3 sm:text-[15px]"
					>
						<span>Next demo</span>
						<Play className="w-4 h-4 text-emerald-400/90" />
						<ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 group-hover:text-emerald-400/80 transition-transform duration-150" />
					</button>

					<div className="flex justify-center gap-2.5">
						{services.map((_, index) => (
							<button
								key={index}
								type="button"
								onClick={() => setCurrentCardIndex(index)}
								className={`h-2 rounded-full transition-all duration-200 ${
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
			</div>
		</section>
	);
}
