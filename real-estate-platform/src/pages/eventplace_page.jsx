import EventPlacesPage from "../components/eventplaces/EventPlacesPage";
import Layout from "../components/layouts/allpagelayout";
export default function EventPlacePage() {
  return (
    <Layout>
       <div className="bg-[#0f1115] min-h-screen text-white pt-24 py-8 max-w-6xl mx-auto">
        <EventPlacesPage/>
      </div>
    </Layout>
  );
}