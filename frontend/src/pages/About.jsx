function About() {
  return (
    <div className="w-full bg-black min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-gray-900/60 border border-gray-700/60 text-yellow-400 px-3 py-1 rounded-full mb-4">
                <span className="text-lg">🥩</span>
                <span className="text-xs tracking-wider">PREMIUM QUALITY MEAT • RWANDA</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                About <span className="bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent">One Genesis</span>
              </h1>
              <p className="text-gray-300 text-lg mt-4">
                We are dedicated to delivering the freshest, highest-quality meats with unwavering commitment to excellence, safety, and customer satisfaction.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-gray-900 border border-gray-700 text-gray-300 text-sm">Sustainable Sourcing</span>
                <span className="px-4 py-2 rounded-full bg-gray-900 border border-gray-700 text-gray-300 text-sm">Cold Chain</span>
                <span className="px-4 py-2 rounded-full bg-gray-900 border border-gray-700 text-gray-300 text-sm">Halal Options</span>
                <span className="px-4 py-2 rounded-full bg-gray-900 border border-gray-700 text-gray-300 text-sm">Fast Delivery</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-64 md:h-80 rounded-2xl shadow-2xl shadow-red-800/30 relative">
                {/* Brand glow frame */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-yellow-500 opacity-70 blur" />
                {/* Image container */}
                <div className="relative h-full w-full rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <img
                    src="/images/2.jpg"
                    alt="One Genesis showcase"
                    loading="lazy"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Soft overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-black border border-gray-700 rounded-xl px-4 py-3 text-gray-300 text-sm shadow-lg">
                Trusted by chefs and families across Rwanda
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-5 text-center">
              <div className="text-yellow-400 text-2xl font-extrabold">10K+</div>
              <div className="text-gray-400 text-xs mt-1">Orders Delivered</div>
            </div>
            <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-5 text-center">
              <div className="text-yellow-400 text-2xl font-extrabold">30+</div>
              <div className="text-gray-400 text-xs mt-1">Products Available</div>
            </div>
            <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-5 text-center">
              <div className="text-yellow-400 text-2xl font-extrabold">100%</div>
              <div className="text-gray-400 text-xs mt-1">Freshness Guaranteed</div>
            </div>
            <div className="bg-gray-900/60 border border-gray-700/60 rounded-xl p-5 text-center">
              <div className="text-yellow-400 text-2xl font-extrabold">24/7</div>
              <div className="text-gray-400 text-xs mt-1">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Our Story */}
        <div className="bg-black rounded-2xl p-8 border border-gray-700 shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Welcome to One Genesis Butcher Shop, your premier destination for the finest quality meats in Rwanda.
            Founded with a passion for excellence and a commitment to serving our community, we have been
            providing fresh, premium cuts that meet the highest standards of quality and taste.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Our experienced butchers carefully select and prepare each cut to ensure you receive only
            the best products for your family. From tender steaks to fresh poultry, we offer a wide
            variety of meats to satisfy all your culinary needs, whether you're preparing a family dinner
            or hosting a special celebration.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            At One Genesis, we believe that great meals start with great ingredients. That's why we
            source our meats from trusted local and international suppliers, maintaining the highest
            standards of freshness, quality, and ethical sourcing in everything we offer.
          </p>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-black rounded-2xl p-8 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="text-3xl mr-3">🎯</span>
              Our Mission
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              To provide our customers with the highest quality meats while delivering exceptional service
              and building lasting relationships within our community. We strive to be Rwanda's most trusted
              butcher shop through our commitment to freshness, quality, and customer satisfaction.
            </p>
          </div>

          <div className="bg-black rounded-2xl p-8 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="text-3xl mr-3">💎</span>
              Our Values
            </h2>
            <ul className="text-gray-300 text-lg leading-relaxed space-y-3">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span><strong className="text-white">Quality:</strong> Never compromising on the standards of our products</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span><strong className="text-white">Freshness:</strong> Ensuring every cut is as fresh as possible</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span><strong className="text-white">Service:</strong> Treating every customer like family</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span><strong className="text-white">Trust:</strong> Building relationships through transparency and reliability</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-black rounded-2xl p-8 border border-gray-700 shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Meet Our Expert Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Master Butcher</h3>
              <p className="text-gray-300">
                Over 15 years of experience in meat cutting and preparation, ensuring every cut meets our high standards.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quality Manager</h3>
              <p className="text-gray-300">
                Responsible for sourcing the finest meats and maintaining our strict quality control standards.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Delivery Team</h3>
              <p className="text-gray-300">
                Dedicated to ensuring your orders reach you fresh and on time, maintaining the cold chain throughout.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment Section + CTA */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Commitment to You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">🌱</span>
                Sustainable Sourcing
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We work with local farmers and ethical suppliers who share our commitment to sustainable
                and responsible meat production practices.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">🏆</span>
                Customer Satisfaction
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Your satisfaction is our priority. We offer personalized service, custom cuts, and
                are always ready to help you find exactly what you need.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">❄️</span>
                Cold Chain Excellence
              </h3>
              <p className="text-gray-300 leading-relaxed">
                From our suppliers to your table, we maintain strict temperature controls to ensure
                maximum freshness and food safety.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">🤝</span>
                Community Focus
              </h3>
              <p className="text-gray-300 leading-relaxed">
                As a local business, we're committed to supporting our community and contributing
                to Rwanda's growing food industry.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <a href="/" className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg">
              <span>🛒</span>
              <span>Shop Now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
