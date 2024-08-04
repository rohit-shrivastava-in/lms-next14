import { getAnalytics } from "@/actions/get-anlytics";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import DataCard from "./_components/data-card";

const AnalyticsPage = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/")
  }

  // const {
  //   data,
  //   totalRevenue,
  //   totalSales
  // } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard />
      </div>

    </div>
  );
}

export default AnalyticsPage;