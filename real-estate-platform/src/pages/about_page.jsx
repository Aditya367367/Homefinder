import Layout from "../components/layouts/allpagelayout";

const AboutPage = () => {
  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 max-w-6xl mx-auto text-white bg-[#0f1115] min-h-screen">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-teal-400">
          About HomeFinder
        </h1>
        <div className="bg-gray-800 p-6 md:p-10 rounded-lg shadow-xl">
          <p className="mb-6 text-lg leading-relaxed">
            Welcome to <strong className="text-teal-300">HomeFinder</strong>, your trusted partner in navigating the exciting journey of finding your perfect home. Our mission is to seamlessly connect individuals and families with their dream properties through a user-friendly and intuitive platform that simplifies every step of the real estate search process.
          </p>
          <p className="mb-6 text-lg leading-relaxed">
            At HomeFinder, we are built on the foundational principles of <strong className="text-teal-300">transparency</strong>, <strong className="text-teal-300">integrity</strong>, and <strong className="text-teal-300">exceptional customer service</strong>. We understand that finding a home is a significant life event, and our dedicated team of experienced real estate professionals is committed to providing unparalleled support and expertise. We're here to help you navigate the dynamic real estate market with absolute ease and confidence.
          </p>
          <p className="text-lg leading-relaxed">
            Whether you're a first-time homebuyer, looking to upgrade, or seeking an investment property, HomeFinder is designed to make your experience efficient, enjoyable, and ultimately successful.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;