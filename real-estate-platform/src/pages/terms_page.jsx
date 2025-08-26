import Layout from "../components/layouts/allpagelayout";

const TermsPage = () => {
  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 max-w-6xl mx-auto text-white bg-[#0f1115] min-h-screen">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-teal-400">
          Terms and Conditions
        </h1>

        <div className="bg-gray-800 p-6 md:p-10 rounded-lg shadow-xl text-lg leading-relaxed">
          <p className="mb-6">
            Welcome to <strong className="text-teal-300">HomeFinder</strong>! These Terms and Conditions ("Terms") outline the rules and regulations for the use of our website and services, located at [Your Website URL Here].
          </p>
          <p className="mb-6">
            By accessing or using our platform, you signify your unreserved acceptance of and agreement to comply with these Terms. Please read them carefully before using our services. If you do not agree with any part of these Terms, you must not use our platform.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By using HomeFinder, you confirm that you are at least 18 years of age and capable of forming a binding contract. You also agree to be bound by these Terms, our Privacy Policy, and all applicable laws and regulations.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">2. Services Offered</h2>
          <p className="mb-4">
            HomeFinder provides an online platform to facilitate the search for real estate properties. Our services include, but are not limited to:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Property listings for sale and rent.</li>
            <li>Search filters and tools to refine property searches.</li>
            <li>Information and resources related to real estate.</li>
            <li>Contact forms to connect with property owners or agents.</li>
          </ul>
          <p className="mb-6">
            We do not act as a real estate broker or agent. Our role is solely to provide a platform for users to connect.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">3. User Responsibilities</h2>
          <p className="mb-4">
            As a user of HomeFinder, you agree to:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Provide accurate and complete information when using our services.</li>
            <li>Use the platform for lawful purposes only.</li>
            <li>Respect the intellectual property rights of HomeFinder and third parties.</li>
            <li>Not engage in any activity that could harm, disable, or impair the functionality of our platform.</li>
            <li>Maintain the confidentiality of your account information.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">4. Intellectual Property</h2>
          <p className="mb-6">
            All content on HomeFinder, including text, graphics, logos, images, and software, is the property of HomeFinder or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">5. Limitation of Liability</h2>
          <p className="mb-6">
            HomeFinder provides its services "as is" and "as available." We do not guarantee the accuracy, completeness, or reliability of any content or information on our platform. To the fullest extent permitted by law, HomeFinder shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your use or inability to use our services.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">6. Changes to Terms</h2>
          <p className="mb-6">
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the updated Terms on this page. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">7. Governing Law</h2>
          <p className="mb-6">
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction Here], without regard to its conflict of law principles.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at [Your Contact Email Here].
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;