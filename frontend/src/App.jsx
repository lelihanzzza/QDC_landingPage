import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [visibleBoxes, setVisibleBoxes] = useState(new Set());
  const [typingHeadings, setTypingHeadings] = useState(new Set());
  const [visibleTimelineBoxes, setVisibleTimelineBoxes] = useState(new Set());
  const [activeDomain, setActiveDomain] = useState("technical");
  const imageRef = useRef(null);
  const boxRefs = useRef([]);
  const headingRefs = useRef([]);
  const timelineBoxRefs = useRef([]);
  const domainCache = useRef({}); // cache for domain details

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsImageVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  // Intersection observer for offering boxes
  useEffect(() => {
    const observers = [];

    boxRefs.current.forEach((box, index) => {
      if (box) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleBoxes((prev) => new Set([...prev, index]));
              }, index * 200); // Delay each box by 200ms
            }
          },
          { threshold: 0.1 }
        );

        observer.observe(box);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Intersection observer for typing headings
  useEffect(() => {
    const observers = [];

    headingRefs.current.forEach((heading, index) => {
      if (heading) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setTypingHeadings((prev) => new Set([...prev, index]));
            }
          },
          { threshold: 0.3 }
        );

        observer.observe(heading);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Intersection observer for timeline boxes
  useEffect(() => {
    const observers = [];

    timelineBoxRefs.current.forEach((timelineBox, index) => {
      if (timelineBox) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleTimelineBoxes((prev) => new Set([...prev, index]));
              }, index * 300); // Delay each timeline box by 300ms
            }
          },
          { threshold: 0.2 }
        );

        observer.observe(timelineBox);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Typing animation function
  const useTypingEffect = (text, isVisible, speed = 100) => {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
      if (!isVisible) return;

      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    }, [text, isVisible, speed]);

    return displayText;
  };

  // Calculate scale and opacity based on scroll
  const scale = Math.max(0.3, 1 - scrollY * 0.001);
  const opacity = Math.max(0, 1 - scrollY * 0.002);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="flex justify-between items-center">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1 z-50"
          >
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></div>
          </button>

          {/* Register Now and Share Buttons */}
          <div className="flex space-x-4">
            <button className="bg-green-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-black hover:text-white transition-colors">
              Register Now
            </button>
            <button className="bg-transparent text-white px-6 py-2 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-black transition-colors">
              Share
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-black bg-opacity-95 backdrop-blur-sm transition-all duration-500 overflow-hidden z-40 ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        >
          <div className="flex flex-col justify-center items-center h-full space-y-8">
            <a
              href="#home"
              className="block text-white text-3xl hover:text-green-500 transition-colors font-semibold"
              onClick={toggleMenu}
            >
              Home
            </a>
            <a
              href="#about"
              className="block text-white text-3xl hover:text-green-500 transition-colors font-semibold"
              onClick={toggleMenu}
            >
              About Us
            </a>
            <a
              href="#timeline"
              className="block text-white text-3xl hover:text-green-500 transition-colors font-semibold"
              onClick={toggleMenu}
            >
              Timeline
            </a>
            <a
              href="#contact"
              className="block text-white text-3xl hover:text-green-500 transition-colors font-semibold"
              onClick={toggleMenu}
            >
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      {/* Fixed Hero Section */}
      <div className="herosection fixed top-0 left-0 w-full h-screen flex flex-col justify-center items-center background z-0">
        <video
          src="/assets/bg.mp4"
          className="bg-hero absolute top-0 left-0 h-full w-full object-cover z-[-1]"
          autoPlay
          loop
          muted
        ></video>
        <img
          src="/assets/logo1.png"
          alt=""
          className="logo h-[19em] w-[19em] z-10 transition-all duration-300"
          style={{
            transform: `scale(${scale})`,
            opacity: opacity,
          }}
        />
        <h1
          className="heading cinzel-medium text-white weight-500 text-4xl md:text-5xl lg:text-6xl transition-all duration-300"
          style={{
            transform: `scale(${scale})`,
            opacity: opacity,
          }}
        >
          Recruitments Open Now
        </h1>
        <button
          className="mt-8 bg-green-500 text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-black hover:text-white transition-all duration-300 z-10"
          style={{
            transform: `scale(${scale})`,
            opacity: opacity,
          }}
        >
          Apply Now
        </button>
      </div>

      {/* Spacer to push content down */}
      <div className="h-screen"></div>

      {/* About Us Section */}
      <section
        id="about"
        className="relative z-10 min-h-screen bg-gradient-to-b from-black via-green-900 to-black py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          {/* About Us Content with Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Side - Content */}
            <div>
              <h2
                ref={(el) => (headingRefs.current[0] = el)}
                className="text-4xl md:text-5xl font-bold text-white mb-8 cinzel-medium"
              >
                {useTypingEffect("About Us", typingHeadings.has(0), 150)}
                {typingHeadings.has(0) && (
                  <span className="animate-pulse text-green-400">|</span>
                )}
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                A fierce community of warriors inspired by Demon Slayer, united
                by the spirit of growth and resilience. Through relentless
                training, missions, and battles of wits, we sharpen our skills
                like Nichirin blades. Together, we learn, fight, and
                rise—empowering each other to become future-ready slayers
                prepared to face any challenge.
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="flex justify-center lg:justify-end relative pb-16">
              <img
                ref={imageRef}
                src="/assets/demon.png"
                alt="Demon Slayer Character"
                className={`w-full max-w-xl h-auto object-contain translate-y-16 z-20 transition-all duration-1000 ease-out ${
                  isImageVisible
                    ? "transform translate-x-[0vw] opacity-100"
                    : "transform -translate-x-[-10vw] opacity-0"
                }`}
              />
            </div>
          </div>

          {/* What We Offer Section */}
          <div className="text-center mb-12">
            <h3
              ref={(el) => (headingRefs.current[1] = el)}
              className="text-3xl md:text-4xl font-bold text-white mb-4 cinzel-medium"
            >
              {useTypingEffect("What We Offer", typingHeadings.has(1), 120)}
              {typingHeadings.has(1) && (
                <span className="animate-pulse text-green-400">|</span>
              )}
            </h3>
            <p className="text-lg text-gray-400 mb-12">
              Dive into the world of{" "}
              <span className="text-green-400">fun and learning</span> with our
              diverse range of opportunities
            </p>
          </div>

          {/* Offerings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Hands-On Learning */}
            <div
              ref={(el) => (boxRefs.current[0] = el)}
              className={`bg-green-50 p-6 border-b-4 border-green-500 hover:transform hover:scale-105 transition-all duration-300 relative overflow-hidden transform ${
                visibleBoxes.has(0)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                perspective: "1000px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `rotateX(10deg) rotateY(10deg) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
              }}
            >
              {/* Character Image */}
              <img
                src="/assets/char1.png"
                alt="Character 1"
                className="absolute bottom-0 right-0 w-20 h-20 object-contain opacity-60 z-0"
              />
              <div className="text-green-500 text-3xl mb-4 relative z-10">
                ⚡
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 relative z-10">
                Hands-On Learning
              </h4>
              <p className="text-gray-600 text-sm relative z-10">
                Experience real-world labs and projects using platforms like
                Google Cloud Skills Boost.
              </p>
            </div>

            {/* Workshops & Bootcamps */}
            <div
              ref={(el) => (boxRefs.current[1] = el)}
              className={`bg-purple-50 p-6 border-b-4 border-purple-500 hover:transform hover:scale-105 transition-all duration-300 relative overflow-hidden transform ${
                visibleBoxes.has(1)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                perspective: "1000px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `rotateX(-10deg) rotateY(-8deg) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
              }}
            >
              {/* Character Image */}
              <img
                src="/assets/char2.png"
                alt="Character 2"
                className="absolute bottom-0 right-0 w-20 h-20 object-contain opacity-60 z-0"
              />
              <div className="text-purple-500 text-3xl mb-4 relative z-10">
                💻
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 relative z-10">
                Workshops & Bootcamps
              </h4>
              <p className="text-gray-600 text-sm relative z-10">
                Upskill with sessions on cloud, AI/ML, Web Dev, DevOps, and
                more.
              </p>
            </div>

            {/* Hackathons */}
            <div
              ref={(el) => (boxRefs.current[2] = el)}
              className={`bg-red-50 p-6 border-b-4 border-red-500 hover:transform hover:scale-105 transition-all duration-300 relative overflow-hidden transform ${
                visibleBoxes.has(2)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                perspective: "1000px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `rotateX(8deg) rotateY(-12deg) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
              }}
            >
              {/* Character Image */}
              <img
                src="/assets/char3.png"
                alt="Character 3"
                className="absolute bottom-0 right-0 w-20 h-20 object-contain opacity-60 z-0"
              />
              <div className="text-red-500 text-3xl mb-4 relative z-10">🏆</div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 relative z-10">
                Hackathons
              </h4>
              <p className="text-gray-600 text-sm relative z-10">
                Build, innovate, and compete in events like our flagship 36-hour
                HackRush.
              </p>
            </div>

            {/* Certification Support */}
            <div
              ref={(el) => (boxRefs.current[3] = el)}
              className={`bg-green-50 p-6 border-b-4 border-green-600 hover:transform hover:scale-105 transition-all duration-300 relative overflow-hidden transform ${
                visibleBoxes.has(3)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                perspective: "1000px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `rotateX(-12deg) rotateY(8deg) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
              }}
            >
              {/* Character Image */}
              <img
                src="/assets/char4.png"
                alt="Character 4"
                className="absolute bottom-0 right-0 w-20 h-20 object-contain opacity-60 z-0"
              />
              <div className="text-green-600 text-3xl mb-4 relative z-10">
                📜
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 relative z-10">
                Certification Support
              </h4>
              <p className="text-gray-600 text-sm relative z-10">
                Get guidance and resources to ace global certifications in cloud
                and emerging tech.
              </p>
            </div>

            {/* Peer-Led Community */}
            <div
              ref={(el) => (boxRefs.current[4] = el)}
              className={`bg-green-50 p-6 border-b-4 border-green-500 hover:transform hover:scale-105 transition-all duration-300 relative overflow-hidden transform ${
                visibleBoxes.has(4)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                perspective: "1000px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `rotateX(12deg) rotateY(6deg) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
              }}
            >
              {/* Character Image */}
              <img
                src="/assets/char5.png"
                alt="Character 5"
                className="absolute bottom-0 right-0 w-20 h-20 object-contain opacity-60 z-0"
              />
              <div className="text-green-500 text-3xl mb-4 relative z-10">
                👥
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 relative z-10">
                Peer-Led Community
              </h4>
              <p className="text-gray-600 text-sm relative z-10">
                Learn, teach, and grow together in a collaborative
                student-driven environment.
              </p>
            </div>

            {/* Tech Talks & Events */}
            <div
              ref={(el) => (boxRefs.current[5] = el)}
              className={`bg-green-50 p-6 border-b-4 border-green-500 hover:transform hover:scale-105 transition-all duration-300 relative overflow-hidden transform ${
                visibleBoxes.has(5)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                perspective: "1000px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `rotateX(-8deg) rotateY(-10deg) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
              }}
            >
              {/* Character Image */}
              <img
                src="/assets/char6.png"
                alt="Character 6"
                className="absolute bottom-0 right-0 w-20 h-20 object-contain opacity-60 z-0"
              />
              <div className="text-green-500 text-3xl mb-4 relative z-10">
                🎯
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 relative z-10">
                Tech Talks & Events
              </h4>
              <p className="text-gray-600 text-sm relative z-10">
                Stay ahead with expert sessions, tool-based workshops, and
                coding contests.
              </p>
            </div>

            {/* Outreach & Impact */}
            <div
              ref={(el) => (boxRefs.current[6] = el)}
              className={`bg-pink-50 p-6 border-b-4 border-pink-500 hover:transform hover:scale-105 transition-all duration-300 relative overflow-hidden transform ${
                visibleBoxes.has(6)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                perspective: "1000px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `rotateX(15deg) rotateY(-6deg) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
              }}
            >
              {/* Character Image */}
              <img
                src="/assets/char7.png"
                alt="Character 7"
                className="absolute bottom-0 right-0 w-20 h-20 object-contain opacity-60 z-0"
              />
              <div className="text-pink-500 text-3xl mb-4 relative z-10">
                ❤️
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 relative z-10">
                Outreach & Impact
              </h4>
              <p className="text-gray-600 text-sm relative z-10">
                Give back to the community through social initiatives and
                mentorship programs.
              </p>
            </div>

            {/* Industry Connections */}
            <div
              ref={(el) => (boxRefs.current[7] = el)}
              className={`bg-yellow-50 p-6 border-b-4 border-yellow-500 hover:transform hover:scale-105 transition-all duration-300 relative overflow-hidden transform ${
                visibleBoxes.has(7)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                perspective: "1000px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `rotateX(-10deg) rotateY(12deg) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
              }}
            >
              {/* Character Image */}
              <img
                src="/assets/char1.png"
                alt="Character 1"
                className="absolute bottom-0 right-0 w-20 h-20 object-contain opacity-60 z-0"
              />
              <div className="text-yellow-500 text-3xl mb-4 relative z-10">
                ✨
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 relative z-10">
                Industry Connections
              </h4>
              <p className="text-gray-600 text-sm relative z-10">
                Connect with tech professionals and explore internship and
                career opportunities with our industry partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Domains (new, matches provided design) */}
      <section className="py-24 px-4 relative bg-gradient-to-b from-white/60 via-white/40 to-white/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 cinzel-medium">
              Our Hero Classes
            </h3>
            <p className="text-lg text-gray-600">
              Explore our specialized teams that collaborate to create the{" "}
              <span className="text-green-600">QDC experience</span>
            </p>
          </div>

          {/* Nav */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {/*
              { id: 'technical', label: '🖥️ Technical' },
              { id: 'creatives', label: '🎨 Creatives' },
              { id: 'events', label: '🎯 Events' },
              { id: 'corporate', label: '💼 Corporate' }
            ].map((d) => (
            */}
            <button
              key={"technical"}
              onClick={async () => {
                // set active and lazy-load details only when clicked
                setActiveDomain("technical");

                // if not already fetched, simulate fetching details (replace with real fetch later)
                if (!domainCache.current) domainCache.current = {};
                if (!domainCache.current["technical"]) {
                  // lightweight simulated fetch; you can replace with fetch()/axios later
                  domainCache.current["technical"] = { loading: true };
                  setVisibleBoxes(new Set(visibleBoxes)); // trigger update

                  try {
                    // small delay to mimic network request
                    await new Promise((res) => setTimeout(res, 300));

                    const sampleDetails = {
                      technical: {
                        title: "Technical Domain",
                        description:
                          "The core of our innovation and development efforts — divided into two subdomains.",
                        items: [
                          {
                            title: "Cloud Computing",
                            body: "Focused on Google Cloud, hands-on labs, workshops, and helping members earn real-world certifications.",
                          },
                          {
                            title: "Web Development",
                            body: "Covers frontend & backend development, building real-world web apps and platforms used within and beyond QDC.",
                          },
                        ],
                      },
                      creatives: {
                        title: "Creatives Domain",
                        description:
                          "The artistic force behind our visual identity and content creation.",
                        items: [
                          {
                            title: "Design Team",
                            body: "Creating stunning visuals, graphics, and UI/UX designs for all QDC platforms and events.",
                          },
                          {
                            title: "Content Creation",
                            body: "Producing engaging content including videos, photos, and social media materials.",
                          },
                        ],
                      },
                      events: {
                        title: "Events Domain",
                        description:
                          "Orchestrating memorable experiences and learning opportunities.",
                        items: [
                          {
                            title: "Event Planning",
                            body: "Planning and executing workshops, hackathons, and tech conferences.",
                          },
                          {
                            title: "Community Engagement",
                            body: "Managing community relations and fostering engagement through various activities.",
                          },
                        ],
                      },
                      corporate: {
                        title: "Corporate Domain",
                        description: "Building bridges between academia and industry.",
                        items: [
                          {
                            title: "Industry Relations",
                            body: "Maintaining partnerships with tech companies and organizing industry collaborations.",
                          },
                          {
                            title: "Professional Development",
                            body: "Facilitating career growth through mentorship programs and professional networking.",
                          },
                        ],
                      },
                    };

                    domainCache.current["technical"] = sampleDetails["technical"];
                    setVisibleBoxes(new Set(visibleBoxes));
                  } catch (err) {
                    domainCache.current["technical"] = { error: true };
                    setVisibleBoxes(new Set(visibleBoxes));
                  }
                }
              }}
              className={`px-6 py-3 rounded-full transform transition-all duration-300 ${
                activeDomain === "technical"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:shadow-sm"
              }`}
            >
              🖥️ Technical
            </button>
            {/*
              <button
                key={d.id}
                onClick={async () => {
                  // set active and lazy-load details only when clicked
                  setActiveDomain(d.id);

                  // if not already fetched, simulate fetching details (replace with real fetch later)
                  if (!domainCache.current) domainCache.current = {};
                  if (!domainCache.current[d.id]) {
                    // lightweight simulated fetch; you can replace with fetch()/axios later
                    domainCache.current[d.id] = { loading: true };
                    setVisibleBoxes(new Set(visibleBoxes)); // trigger update

                    try {
                      // small delay to mimic network request
                      await new Promise((res) => setTimeout(res, 300));

                      const sampleDetails = {
                        technical: {
                          title: 'Technical Domain',
                          description:
                            'The core of our innovation and development efforts — divided into two subdomains.',
                          items: [
                            { title: 'Cloud Computing', body: 'Focused on Google Cloud, hands-on labs, workshops, and helping members earn real-world certifications.' },
                            { title: 'Web Development', body: 'Covers frontend & backend development, building real-world web apps and platforms used within and beyond QDC.' }
                          ]
                        },
                        creatives: {
                          title: 'Creatives Domain',
                          description: 'The artistic force behind our visual identity and content creation.',
                          items: [
                            { title: 'Design Team', body: 'Creating stunning visuals, graphics, and UI/UX designs for all QDC platforms and events.' },
                            { title: 'Content Creation', body: 'Producing engaging content including videos, photos, and social media materials.' }
                          ]
                        },
                        events: {
                          title: 'Events Domain',
                          description: 'Orchestrating memorable experiences and learning opportunities.',
                          items: [
                            { title: 'Event Planning', body: 'Planning and executing workshops, hackathons, and tech conferences.' },
                            { title: 'Community Engagement', body: 'Managing community relations and fostering engagement through various activities.' }
                          ]
                        },
                        corporate: {
                          title: 'Corporate Domain',
                          description: 'Building bridges between academia and industry.',
                          items: [
                            { title: 'Industry Relations', body: 'Maintaining partnerships with tech companies and organizing industry collaborations.' },
                            { title: 'Professional Development', body: 'Facilitating career growth through mentorship programs and professional networking.' }
                          ]
                        }
                      };

                      domainCache.current[d.id] = sampleDetails[d.id];
                      setVisibleBoxes(new Set(visibleBoxes));
                    } catch (err) {
                      domainCache.current[d.id] = { error: true };
                      setVisibleBoxes(new Set(visibleBoxes));
                    }
                  }
                }}
                className={`px-6 py-3 rounded-full transform transition-all duration-300 ${
                  activeDomain === d.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:shadow-sm'
                }`}
              >
                {d.label}
              </button>
            */}
          </div>

          {/* Content card */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-8">
              <h4 className="text-2xl font-bold text-white">
                {(
                  domainCache.current &&
                  domainCache.current[activeDomain] &&
                  domainCache.current[activeDomain].title
                ) || "Technical Domain"}
              </h4>
              <p className="text-blue-100 mt-2">
                {(
                  domainCache.current &&
                  domainCache.current[activeDomain] &&
                  domainCache.current[activeDomain].description
                ) ||
                  "The core of our innovation and development efforts — divided into two subdomains."}
              </p>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6 bg-gray-50">
              {(
                (domainCache.current &&
                  domainCache.current[activeDomain] &&
                  domainCache.current[activeDomain].items) ||
                []
              ).map((it, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                >
                  <h5 className="font-semibold text-gray-800 mb-2">
                    {it.title}
                  </h5>
                  <p className="text-gray-500 text-sm">{it.body}</p>
                </div>
              ))}

              {/* if no items yet, show placeholders */}
              {(!domainCache.current ||
                !domainCache.current[activeDomain] ||
                !domainCache.current[activeDomain].items) && (
                <div className="col-span-2 p-6 text-center text-gray-500">
                  Select a domain to load details
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="min-h-screen py-20 px-4 relative bg-gradient-to-b from-black via-green-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              ref={(el) => (headingRefs.current[5] = el)}
              className="text-4xl md:text-6xl font-bold text-white mb-4 relative z-10 cinzel-medium"
              style={{ opacity: 1 }}
            >
              {useTypingEffect(
                "Recruitment Timeline",
                typingHeadings.has(5),
                100
              )}
              {typingHeadings.has(2) && (
                <span className="animate-pulse text-green-400">|</span>
              )}
            </h2>
            <p
              className="text-xl text-gray-300 max-w-3xl mx-auto relative z-10"
              style={{ opacity: 1 }}
            >
              Your journey to becoming a Demon Slayer warrior starts here.
              Follow the path and prepare for each stage.
            </p>
          </div>

          {/* Timeline Container */}
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Items - Stair Steps */}
            <div className="space-y-8">
              {/* Recruitment Starts - Step 1 */}
              <div className="ml-0">
                <div
                  ref={(el) => (timelineBoxRefs.current[0] = el)}
                  className={`bg-gradient-to-r from-green-900 to-black p-6 relative max-w-sm transition-all duration-1000 ease-out transform overflow-hidden ${
                    visibleTimelineBoxes.has(0)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-full"
                  }`}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                  }}
                >
                  {/* Character Image */}
                  <img
                    src="/assets/char5.png"
                    alt="Character 5"
                    className="absolute bottom-0 right-0 w-16 h-16 object-contain opacity-40 z-0"
                  />
                  <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
                    Recruitment Starts
                  </h3>
                  <p className="text-green-400 text-lg mb-2 relative z-10">
                    March 1, 2025
                  </p>
                  <p className="text-gray-300 text-sm relative z-10">
                    The gates open for aspiring slayers. Begin your application
                    and showcase your potential to join our elite ranks.
                  </p>
                </div>
              </div>

              {/* Forms Closed - Step 2 */}
              <div className="ml-48">
                <div
                  ref={(el) => (timelineBoxRefs.current[1] = el)}
                  className={`bg-gradient-to-r from-orange-900 to-black p-6 relative max-w-sm transition-all duration-1000 ease-out transform overflow-hidden ${
                    visibleTimelineBoxes.has(1)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-full"
                  }`}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                  }}
                >
                  {/* Character Image */}
                  <img
                    src="/assets/char6.png"
                    alt="Character 6"
                    className="absolute bottom-0 right-0 w-16 h-16 object-contain opacity-40 z-0"
                  />
                  <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
                    Forms Closed
                  </h3>
                  <p className="text-orange-400 text-lg mb-2 relative z-10">
                    March 20, 2025
                  </p>
                  <p className="text-gray-300 text-sm relative z-10">
                    Application period ends. Time to sharpen your skills and
                    prepare for the trials ahead.
                  </p>
                </div>
              </div>

              {/* Interview Starts - Step 3 */}
              <div className="ml-96">
                <div
                  ref={(el) => (timelineBoxRefs.current[2] = el)}
                  className={`bg-gradient-to-r from-red-900 to-black p-6 relative max-w-sm transition-all duration-1000 ease-out transform overflow-hidden ${
                    visibleTimelineBoxes.has(2)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-full"
                  }`}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                  }}
                >
                  {/* Character Image */}
                  <img
                    src="/assets/char7.png"
                    alt="Character 7"
                    className="absolute bottom-0 right-0 w-16 h-16 object-contain opacity-40 z-0"
                  />
                  <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
                    Interview Starts
                  </h3>
                  <p className="text-red-400 text-lg mb-2 relative z-10">
                    April 1, 2025
                  </p>
                  <p className="text-gray-300 text-sm relative z-10">
                    The real battle begins. Face the masters and prove your
                    worth through intensive interviews and challenges.
                  </p>
                </div>
              </div>

              {/* Results - Step 4 */}
              <div className="ml-144">
                <div
                  ref={(el) => (timelineBoxRefs.current[3] = el)}
                  className={`bg-gradient-to-r from-purple-900 to-black p-6 relative max-w-sm transition-all duration-1000 ease-out transform overflow-hidden ${
                    visibleTimelineBoxes.has(3)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-full"
                  }`}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                  }}
                >
                  {/* Character Image */}
                  <img
                    src="/assets/char1.png"
                    alt="Character 1"
                    className="absolute bottom-0 right-0 w-16 h-16 object-contain opacity-40 z-0"
                  />
                  <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
                    Results
                  </h3>
                  <p className="text-purple-400 text-lg mb-2 relative z-10">
                    April 15, 2025
                  </p>
                  <p className="text-gray-300 text-sm relative z-10">
                    The moment of truth arrives. Successful warriors will be
                    welcomed into the corps and begin their training.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Group Image at bottom-left of Timeline section */}
        <div className="absolute bottom-0 left-48">
          <img
            src="/assets/group.png"
            alt="Demon Slayer Group"
            className="w-128 h-128 md:w-120 md:h-55 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </section>

      {/* Contact Us & Footer Section */}
      <section className="bg-gradient-to-br from-green-900 via-black to-red-900 relative">
        {/* Contact Us Part */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2
                ref={(el) => (headingRefs.current[3] = el)}
                className="text-4xl md:text-6xl font-bold text-white mb-4 cinzel-medium"
              >
                {useTypingEffect("Contact Us", typingHeadings.has(3), 150)}
                {typingHeadings.has(3) && (
                  <span className="animate-pulse text-green-400">|</span>
                )}
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Ready to join Qwiklab Developers Clubs? Reach out to us and begin
                your journey.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-black/60 backdrop-blur-sm p-8 rounded-lg border border-green-500/30">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Send a Message
                  </h3>
                  <form className="space-y-6">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Your Phone"
                        className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <textarea
                        rows="4"
                        placeholder="Your Message"
                        className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors resize-none"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Send Message ⚔️
                    </button>
                  </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                  <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-green-500/20">
                    <div className="flex items-center mb-4">
                      <div className="text-green-400 text-2xl mr-4">📧</div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Email</h4>
                        <p className="text-gray-300">
                          sampleemaillol@brah.org
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-green-500/20">
                    <div className="flex items-center mb-4">
                      <div className="text-green-400 text-2xl mr-4">📞</div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Phone</h4>
                        <p className="text-gray-300">+91 750600****</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-green-500/20">
                    <div className="flex items-center mb-4">
                      <div className="text-green-400 text-2xl mr-4">📍</div>
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          Headquarters
                        </h4>
                        <p className="text-gray-300">
                          Mount Fujikasane Training Grounds (Mostly Tech Park 401/2)
                        </p>
                        <p className="text-gray-400 text-sm">SRMIST, Kattanulathur</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-green-500/20">
                    <div className="flex items-center mb-4">
                      <div className="text-green-400 text-2xl mr-4">🕐</div>
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          Gooning hours (HAHAHA)
                        </h4>
                        <p className="text-gray-300">24/7 Coding Activity</p>
                        <p className="text-gray-400 text-sm">
                          Always ready for hackathons
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Part */}
        <div className="border-t border-green-500/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Logo & Description */}
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="text-green-400 text-3xl mr-3">⚔️</div>
                  <h3 className="text-2xl font-bold text-white">
                    Qwiklab Developers Club
                  </h3>
                </div>
                <p className="text-gray-400 max-w-md mb-6">
                  Qwiklabs Developer Club is a student community at SRM Institute of Science and Technology dedicated to fostering technical skills, innovation, and professional growth.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-green-400 hover:text-green-300 transition-colors text-xl"
                  >
                    📱
                  </a>
                  <a
                    href="#"
                    className="text-green-400 hover:text-green-300 transition-colors text-xl"
                  >
                    🐦
                  </a>
                  <a
                    href="#"
                    className="text-green-400 hover:text-green-300 transition-colors text-xl"
                  >
                    📘
                  </a>
                  <a
                    href="#"
                    className="text-green-400 hover:text-green-300 transition-colors text-xl"
                  >
                    📺
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#timeline"
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      Recruitment Timeline
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm mb-4 md:mb-0">
                  © 2025 Demon Slayer Corps. All rights reserved. | Protecting
                  humanity since the Heian period.
                </p>
                <div className="flex space-x-6 text-sm">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Code of Conduct
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
