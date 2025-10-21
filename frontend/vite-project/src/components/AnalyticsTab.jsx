import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				setAnalyticsData(response.data.analyticsData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return <div className="text-center text-gray-300">Loading analytics...</div>;
	}

	return (
		<motion.div
			className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					color='from-emerald-500 to-teal-700'
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color='from-emerald-500 to-green-700'
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color='from-emerald-500 to-cyan-700'
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`$${analyticsData.totalRevenue.toFixed(2)}`}
					icon={DollarSign}
					color='from-emerald-500 to-lime-700'
				/>
			</div>
		</motion.div>
	);
};

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	<motion.div
		className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-center'>
			<div className='z-10'>
				<p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>
				<h3 className='text-white text-3xl font-bold'>{value}</h3>
			</div>
		</div>
		<div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />
		<div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
			<Icon className='h-32 w-32' />
		</div>
	</motion.div>
);

export default AnalyticsTab;
