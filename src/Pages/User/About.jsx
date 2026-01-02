import { FaHeart, FaGraduationCap, FaEyeSlash, FaShieldAlt, FaGem, FaLock } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";


const About = () => {
  return (
    <div className="about">
      <section className="about-page-container">
        <div className="container">
          <div className="row align-items-start gy-4">

            {/* LEFT CONTENT */}
            <div className="col-lg-6">
              <span className="mission-tag">OUR MISSION</span>

              <h2 className="mission-title">
                Shifting the conversation from <br />
                taboo to <span>wellness.</span>
              </h2>

              <p className="mission-text">
                We believe pleasure is a fundamental part of well-being, just like
                sleep, nutrition, and exercise. For too long, the industry has
                been dominated by sleazy stereotypes. Velvet & Vine exists to
                create a safe, sophisticated space for exploration.
              </p>

              <p className="mission-text">
                Our commitment goes beyond products; we are building a community
                focused on education, consent, and body positivity.
              </p>
            </div>

            {/* RIGHT CARDS */}
            <div className="col-lg-6">
              <div className="row gy-4">

                <div className="col-md-6">
                  <div className="mission-card" data-aos="fade-down-right">
                    <div className="icon-box heart">
                      <FaHeart />
                    </div>
                    <h5>Sexual Wellness</h5>
                    <p>
                      Promoting a healthy, shame-free approach to intimacy as
                      self-care.
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mission-card" data-aos="fade-down-left">
                    <div className="icon-box spark">
                      <HiSparkles />
                    </div>
                    <h5>Empowerment</h5>
                    <p>
                      Encouraging confidence and self-discovery through premium
                      experiences.
                    </p>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="mission-card" data-aos="zoom-in">
                    <div className="icon-box edu">
                      <FaGraduationCap />
                    </div>
                    <h5>Education First</h5>
                    <p>
                      Providing expert-backed guides to help you navigate your
                      journey with knowledge.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="care">
        <div className="container">
          <div className="curated-card">

            {/* LEFT IMAGE */}
            <div className="curated-image" data-aos="flip-left">
              {/* you will add image here */}
              <img src={require('../../Img/about.png')} alt="Curated products" />
            </div>

            {/* RIGHT CONTENT */}
            <div className="curated-content" data-aos="flip-right">
              <h2>
                Curated with <span>Care</span>
              </h2>

              <p>
                Velvet & Vine began with a simple question: Why is shopping for
                adult products so often uncomfortable? We set out to change that
                experience entirely.
              </p>

              <p>
                Every product in our collection is hand-picked for its quality,
                body-safe materials, and design aesthetic. We reject the clutter
                of endless options in favor of a curated selection that truly
                performs.
              </p>

              <div className="signature">The V&V Team</div>
            </div>

          </div>
        </div>
      </section>

      <section className="core-values">
        <div className="container">

          {/* HEADER */}
          <div className="core-header">
            <h2>Our Core Values</h2>
            <p>
              We take your privacy and safety as seriously as your pleasure.
              Here is our promise to you.
            </p>
          </div>

          {/* VALUES GRID */}
          <div className="values-grid">

            <div className="value-card red" data-aos="fade-up-right">
              <div className="icon">
                <FaEyeSlash />
              </div>
              <h4>Discretion First</h4>
              <p>
                Plain, unmarked boxes and generic billing descriptors.
                Your business stays yours.
              </p>
            </div>

            <div className="value-card yellow" data-aos="fade-up-right">
              <div className="icon">
                <FaShieldAlt />
              </div>
              <h4>Body-Safe Materials</h4>
              <p>
                Strict adherence to medical-grade silicone and non-toxic
                materials. No phthalates, ever.
              </p>
            </div>

            <div className="value-card red" data-aos="fade-up-right">
              <div className="icon">
                <FaGem />
              </div>
              <h4>Curated Quality</h4>
              <p>
                We rigorously test products. If it doesn't meet our
                high standards, we don't sell it.
              </p>
            </div>

            <div className="value-card yellow" data-aos="fade-up-right">
              <div className="icon">
                <FaLock />
              </div>
              <h4>Secure Shopping</h4>
              <p>
                State-of-the-art 256-bit encryption protects your
                data at every step of the checkout.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
