import Home from "../components/home/index";
import Layout from "../components/layouts/allpagelayout";

export default function HomePage() {
  return (
    <Layout>
      <main className="min-h-screen text-white">
        <Home />
      </main>
    </Layout>
  );
}
