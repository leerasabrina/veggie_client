import { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../Loader/Loader";

const Overview = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role;

  // Fetch price history
  const { data = [], isLoading } = useQuery({
  queryKey: ["priceHistory"],
  queryFn: async () => {
    const res = await axios.get("https://server-side-nine-ruddy.vercel.app/public/products/prices");
    return res.data;
  },
});

  // Prepare chart data: group by date, add products as keys
  const chartData = [];
  const productsSet = new Set();

  data.forEach((doc) => {
    const allItems = [{ name: doc.itemName, price: doc.pricePerUnit }];

    // include additional items from prices array if it exists
    if (Array.isArray(doc.prices)) {
      doc.prices.forEach((p) => {
        allItems.push({ name: p.name, price: p.price });
      });
    }

    allItems.forEach((item) => {
      productsSet.add(item.name);
      let dateEntry = chartData.find((d) => d.date === doc.date);
      if (!dateEntry) {
        dateEntry = { date: doc.date };
        chartData.push(dateEntry);
      }
      dateEntry[item.name] = item.price;
    });
  });

  const products = Array.from(productsSet);

  const colors = ["#82ca9d", "#8884d8", "#ffc658", "#ff7f50", "#8dd1e1"];
  const getColor = (index) => colors[index % colors.length];

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="px-6 space-y-6">
      
      {/* Bar Chart */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Market Prices Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {products.map((product, index) => (
              <Bar
                key={product}
                dataKey={product}
                fill={getColor(index)}
                name={product}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;
