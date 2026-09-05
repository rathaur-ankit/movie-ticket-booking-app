import { useState, useEffect } from 'react';
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, UserIcon } from 'lucide-react';
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    { title: 'Total Bookings', value: dashboardData.totalBookings || '0', icon: ChartLineIcon },
    { title: 'Total Revenue', value: `${currency || '$'}${dashboardData.totalRevenue || '0'}`, icon: CircleDollarSignIcon },
    { title: 'Active Shows', value: dashboardData.activeShows?.length || '0', icon: PlayCircleIcon },
    { title: 'Total Users', value: dashboardData.totalUser || '0', icon: UserIcon },
  ];

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />
      <div className="flex flex-wrap gap-4 w-full mt-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full"
          >
            <div>
              <h1 className="text-sm">{card.title}</h1>
              <p className="text-xl font-medium mt-1">{card.value}</p>
            </div>
            <card.icon className="w-6 h-6" />
          </div>
        ))}
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Dashboard;
