import EventPlaceDetailPage from "../components/eventplaces/EventPlaceDetailPage";
import Layout from "../components/layouts/allpagelayout";
export default function EventPlaceDetailPageWrapper() {
  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 max-w-5xl mx-auto text-white bg-[#0f1115] min-h-screen">
        <EventPlaceDetailPage />
      </div>
    </Layout>
  );
}