import React, { useEffect } from "react";
import Container from "../container/Container";

const AboutPage = () => {
  useEffect(() => {
    document.title = "About - MegaBlog";
  }, []);

  return (
    <Container>
        <div className="w-full min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            About <span className="bg-yellow-400 px-4 py-2"> MegaBlog </span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl">
            Sharing insights, ideas, and stories from creators around the world.
          </p>
        </section>

        {/* Mission Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            At MegaBlog, our mission is to empower creators and readers alike
            by providing a platform to share ideas, learn from one another, and
            inspire positive change through knowledge and storytelling.
          </p>
        </section>

        {/* What We Do Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            What We Do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="font-semibold text-lg mb-2">Informative Articles</h3>
              <p className="text-gray-600 text-sm">
                Curated articles across technology, lifestyle, and personal growth.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="font-semibold text-lg mb-2">Community Stories</h3>
              <p className="text-gray-600 text-sm">
                Inspiring stories and experiences shared by our amazing community.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="font-semibold text-lg mb-2">Expert Tips</h3>
              <p className="text-gray-600 text-sm">
                Practical tips and guides from experts in different fields.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["M_Kashaf", "Shaheer_Khalid", "Sameed_Akhtar", "Husnain_Yaseen"].map((name) => (
              <div
                key={name}
                className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-yellow-400 mb-4"></div>
                <h3 className="font-semibold text-lg">{name}</h3>
                <p className="text-gray-500 text-sm">Content Creator</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact / Call to Action */}
        <section className="bg-gray-100 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600 mb-6">
            Stay updated with the latest posts and news by subscribing to our newsletter.
          </p>
          <button className="bg-yellow-400 text-gray-800 px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-300">
            Subscribe Now
          </button>
        </section>
      </div>
    </div>
    </Container>
  );
};

export default AboutPage;
