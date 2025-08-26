import Layout from "../components/layouts/allpagelayout";

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 lg:px-12 max-w-6xl mx-auto text-white bg-[#0f1115] min-h-screen">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-teal-400">
          Privacy Policy
        </h1>

        <div className="bg-gray-800 p-6 md:p-10 rounded-lg shadow-xl text-lg leading-relaxed">
          <p className="mb-6">
            Last Updated: July 22, 2025
          </p>
          <p className="mb-6">
            Welcome to <strong className="text-teal-300">HomeFinder</strong>! This Privacy Policy describes how HomeFinder ("we," "us," or "our") collects, uses, and protects your personal information when you visit and use our website, located at [Your Website URL Here].
          </p>
          <p className="mb-6">
            Your privacy is of utmost importance to us. By using our services, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">1. Information We Collect</h2>
          <p className="mb-4">
            We may collect various types of information from and about users of our website, including:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>
              <strong className="text-teal-300">Personal Identification Information:</strong> Name, email address, phone number, and any other information you voluntarily provide when you register for an account, fill out forms, or contact us.
            </li>
            <li>
              <strong className="text-teal-300">Usage Data:</strong> Information on how the website is accessed and used. This may include your computer's Internet Protocol (IP) address, browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
            </li>
            <li>
              <strong className="text-teal-300">Location Data:</strong> If you use certain features that require location services (e.g., searching for properties near your current location), we may collect and process information about your actual location.
            </li>
            <li>
              <strong className="text-teal-300">Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </li>
          </ul>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the collected data for various purposes, including to:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Provide and maintain our service.</li>
            <li>Notify you about changes to our service.</li>
            <li>Allow you to participate in interactive features of our service when you choose to do so.</li>
            <li>Provide customer support.</li>
            <li>Gather analysis or valuable information so that we can improve our service.</li>
            <li>Monitor the usage of our service.</li>
            <li>Detect, prevent, and address technical issues.</li>
            <li>Communicate with you, including sending newsletters, marketing or promotional materials, and other information that may be of interest to you.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">3. Data Security</h2>
          <p className="mb-6">
            The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security. We implement a variety of security measures, including [mention specific measures like SSL, encryption, access controls if applicable, but keep it general if not sure], to maintain the safety of your personal information.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">4. Disclosure of Data</h2>
          <p className="mb-4">
            We may disclose your personal information in the good faith belief that such action is necessary to:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Comply with a legal obligation.</li>
            <li>Protect and defend the rights or property of HomeFinder.</li>
            <li>Prevent or investigate possible wrongdoing in connection with the service.</li>
            <li>Protect the personal safety of users of the service or the public.</li>
            <li>Protect against legal liability.</li>
          </ul>
          <p className="mb-6">
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except to trusted third parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">5. Your Data Protection Rights</h2>
          <p className="mb-6">
            Depending on your location, you may have the following data protection rights: the right to access, update or delete the information we have on you; the right of rectification; the right to object; the right of restriction; the right to data portability; and the right to withdraw consent. To exercise any of these rights, please contact us.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">6. Links to Other Sites</h2>
          <p className="mb-6">
            Our service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">7. Children's Privacy</h2>
          <p className="mb-6">
            Our service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Information, please contact us. If we become aware that we have collected Personal Information from children without verification of parental consent, we take steps to remove that information from our servers.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">8. Changes to This Privacy Policy</h2>
          <p className="mb-6">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4 text-teal-300">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>By email: [Your Contact Email Here]</li>
            <li>By visiting this page on our website: [Your Contact Page URL Here]</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;