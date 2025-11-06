'use client';

import ServiceCard from './ServiceCard';
import { Mic, MessageSquare, GitBranch, Crown, ChevronRight, Play } from 'lucide-react';
import { useState } from 'react';

const services = [
	{
		icon: Mic,
		title: 'Voice Agent Demo',
		description:
			'Experience natural voice interfaces powered by advanced speech recognition. Try our voice agent that handles customer calls, answers questions, and automates responses.',
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
		title: 'n8n Automation Demo',
		description:
			'Visual workflow automation connecting all your apps. See how we connect Slack, Gmail, Notion, and more with custom n8n workflows.',
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
				className="py-24 bg-slate-950 relative overflow-hidden"
			>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center mb-16">
					{/* Premium Services Button */}
					<div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-8 backdrop-blur-sm">
						<Crown className="w-5 h-5" />
						<span className="font-medium">Premium Services</span>
					</div>

					{/* Heading */}
					<h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
						Try Our
						<span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
							Interactive Demos
						</span>
					</h2>

					{/* Description */}
					<p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
						Experience our voice agents, AI chatbots, and n8n automations in action. See how we can transform your business workflows.
					</p>
				</div>

				{/* Stacked Card Container */}
				<div className="relative max-w-4xl mx-auto">
					<div className="relative h-[500px] mb-20 min-h-[500px]">
						{services.map((service, index) => (
							<div
								key={service.title}
								className={`absolute inset-0 w-full transition-all duration-500 ease-in-out ${
									index === currentCardIndex
										? 'opacity-100 z-20 transform translate-y-0 scale-100'
										: index === (currentCardIndex + 1) % services.length
										? 'opacity-40 z-10 scale-95 transform translate-y-8'
										: 'opacity-0 z-0 scale-90 transform translate-y-16 pointer-events-none'
								}`}
								style={{ 
									visibility: index === currentCardIndex || index === (currentCardIndex + 1) % services.length ? 'visible' : 'hidden'
								}}
							>
								<ServiceCard
									{...service}
									delay={0}
									currentIndex={index}
									isActive={index === currentCardIndex}
								/>
							</div>
						))}
					</div>

					{/* Navigation Controls */}
					<div className="flex flex-col items-center gap-8">
						{/* Cycle Button */}
						<button
							onClick={nextCard}
							className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 hover:scale-105 active:scale-95"
						>
							<span className="text-lg">Try Next Demo</span>
							<Play className="w-5 h-5" />
							<ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
						</button>

						{/* Card Indicators */}
						<div className="flex justify-center gap-3">
							{services.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentCardIndex(index)}
									className={`w-4 h-4 rounded-full transition-all duration-300 ${
										index === currentCardIndex
											? 'bg-emerald-500 scale-125 shadow-lg shadow-emerald-500/50'
											: 'bg-slate-600 hover:bg-slate-500 hover:scale-110'
									}`}
								/>
							))}
						</div>

						{/* Card Counter */}
						<div className="text-slate-400 text-sm">
							{currentCardIndex + 1} of {services.length}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
