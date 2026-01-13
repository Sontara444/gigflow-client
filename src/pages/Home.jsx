import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, Globe, Zap, Briefcase, Users, TrendingUp } from 'lucide-react';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0F19] transition-colors duration-500 overflow-x-hidden selection:bg-indigo-500/30">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px] dark:opacity-20"></div>
                <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-500 opacity-20 blur-[120px] dark:opacity-10"></div>
            </div>

            <div className="flex-grow z-10 relative">
                <div className="relative pt-24 md:pt-32 pb-32">
                    <div className="container mx-auto px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-500/30 backdrop-blur-sm mb-10 animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-300">New Era of Work</span>
                        </div>
                        <h1 className="max-w-5xl mx-auto text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-8 leading-[0.9] drop-shadow-sm">
                            Work Without <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x bg-300%">Limits.</span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-12">
                            The decentralized marketplace for the world's top 1% of talent. <br className="hidden md:block" /> Secure, fast, and completely compliant.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
                            <Link to="/gigs" className="relative group px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-lg font-bold transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]">
                                <span className="flex items-center gap-2">
                                    Start Hiring
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link to="/create-gig" className="px-10 py-4 bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-full text-lg font-bold transition-all hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105">
                                Find Work
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 md:gap-12 pb-10">
                            {[
                                { label: 'Active Projects', value: '400+' },
                                { label: 'Total Revenue', value: '$12M' },
                                { label: 'Freelancers', value: '8.5k' },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center px-6 py-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md border border-slate-100 dark:border-white/10">
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                                    <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-xl">
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
                                    Everything you need. <br />
                                    <span className="text-indigo-600 dark:text-indigo-400">Nothing you don't.</span>
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg">Streamlined tools for the modern independent professional.</p>
                            </div>
                            <Link to="/register" className="hidden md:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-3 transition-all">
                                Create an account <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-10 transition-all hover:border-indigo-500/50">
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-6">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Lightning Fast Workflow</h3>
                                        <p className="text-slate-600 dark:text-slate-400 max-w-sm">From proposal to payment in record time. Our automated tools handle the boring stuff.</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 flex-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full w-3/4 bg-indigo-500 rounded-full"></div>
                                        </div>
                                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">75% Faster</span>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-100/50 to-transparent dark:from-indigo-900/20 dark:to-transparent"></div>
                            </div>

                            <div className="md:col-span-1 group relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-black border border-slate-800 dark:border-white/10 p-10 text-white">
                                <div className="absolute top-0 right-0 p-6 opacity-20">
                                    <Shield className="w-32 h-32 text-indigo-500" />
                                </div>
                                <div className="relative z-10 h-full flex flex-col justify-end">
                                    <Shield className="w-10 h-10 text-indigo-400 mb-6" />
                                    <h3 className="text-2xl font-bold mb-2">Bank-Grade Security</h3>
                                    <p className="text-slate-400 text-sm">Escrow payments and verified identity for peace of mind.</p>
                                </div>
                            </div>

                            <div className="md:col-span-1 group relative overflow-hidden rounded-3xl bg-white dark:bg-indigo-600 border border-slate-200 dark:border-indigo-500 p-8 flex flex-col justify-center items-center text-center hover:-translate-y-1 transition-transform">
                                <div className="w-16 h-16 bg-indigo-50 dark:bg-white/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-white mb-6">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Community First</h3>
                                <p className="text-slate-500 dark:text-indigo-100 text-sm">Join 10,000+ others.</p>
                            </div>

                            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-10 flex items-center transition-all hover:border-purple-500/50">
                                <div className="flex-1 pr-6 relative z-10">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Global Payments</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6">Get paid in USD, EUR, GBP, or Crypto. Instant withdrawals available.</p>
                                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">View payout options &rarr;</span>
                                </div>
                                <div className="w-1/3 aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                                    <Globe className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;
