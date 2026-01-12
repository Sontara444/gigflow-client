import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

const CreateGig = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/gigs`,
                { title, description, budget },
                { withCredentials: true }
            );
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition"
            >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back to Dashboard
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors duration-300">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                    <h1 className="text-3xl font-bold">Post a New Gig</h1>
                    <p className="opacity-90 mt-2">Describe your project requirements to find the perfect talent.</p>
                </div>

                <form onSubmit={submitHandler} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Gig Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900 transition outline-none"
                            placeholder="e.g. Build a Modern React Website"
                            required
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Make it catchy and clear.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900 transition outline-none h-40 resize-none"
                            placeholder="Describe the project details, requirements, and timeline..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Budget ($)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">$</span>
                            <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900 transition outline-none"
                                placeholder="e.g. 500"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
                            {loading ? <Loader2 className="animate-spin" /> : 'Publish Gig Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGig;
