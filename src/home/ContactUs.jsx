export default function ContactUs() {
  return (
    <div className="py-12 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-base-content/70">Have questions? We're here to help!</p>
        </div>
        <form className="max-w-md mx-auto">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Name</span>
            </label>
            <input type="text" placeholder="Your Name" className="input input-bordered w-full" />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Your Email</span>
            </label>
            <input type="email" placeholder="Your Email" className="input input-bordered w-full" />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Your Phone</span>
            </label>
            <input type="tel" placeholder="Your Phone" className="input input-bordered w-full" />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Your Message</span>
            </label>
            <textarea placeholder="Your Message" className="textarea textarea-bordered h-24"></textarea>
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  )
}

