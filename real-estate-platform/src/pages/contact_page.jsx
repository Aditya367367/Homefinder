import Layout from "../components/layouts/allpagelayout";

const ContactPage = () => {
  return (
    <Layout>
      <div className="pt-24 px-4 md:px-8 max-w-5xl mx-auto text-white bg-[#0f1115] min-h-screen">
        <div className="py-12 md:py-20"> {/* Added vertical padding for better spacing */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-teal-400"> {/* Larger, bolder heading, centered, with a distinct color */}
            Get in Touch!
          </h1>
          <p className="text-lg mb-8 text-center max-w-2xl mx-auto"> {/* Centered and slightly larger intro text */}
            We'd love to hear from you! Whether you have questions, feedback, or need assistance, feel free to reach out through any of the channels below.
          </p>

          <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700"> {/* Styled container for contact info */}
            <h2 className="text-2xl font-semibold mb-6 text-teal-300">Contact Information</h2> {/* Subheading for contact details */}
            <ul className="space-y-4 text-lg"> {/* Increased spacing between list items and larger text */}
              <li>
                <span className="font-semibold text-gray-300 mr-2">Email:</span>
                <a href="mailto:babatillu@gmail.com" className="text-blue-400 hover:text-blue-300 transition duration-300 ease-in-out">
                  babatillu@gmail.com
                </a>
              </li>
              <li>
                <span className="font-semibold text-gray-300 mr-2">Phone:</span>
                <a href="tel:+1234567890" className="text-blue-400 hover:text-blue-300 transition duration-300 ease-in-out">
                  +123 456 7890
                </a>
              </li>
              <li>
                <span className="font-semibold text-gray-300 mr-2">Address:</span>
                <span className="text-gray-200">123 HomeFinder St, City, Country</span>
              </li>
            </ul>
          </div>

          <p className="mt-10 text-md text-center text-gray-400"> {/* Styled availability text */}
            Our dedicated support team is available Monday to Friday from <span className="font-medium text-gray-300">9 AM to 5 PM IST</span>. We aim to respond to all inquiries within 24 hours.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default ContactPage;