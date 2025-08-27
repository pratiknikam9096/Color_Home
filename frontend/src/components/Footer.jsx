import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Divya Colour Home</h3>
            <p className="text-gray-400">Bringing Colors to Life</p>
            <p className="text-gray-400 mt-2">
              Yakatput Road, Ausa, Latur,
              <br />
              Maharashtra 413520
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-white">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <p className="text-gray-400">
              Phone: <a href="tel:9096457620" className="hover:text-white">9096457620</a>
            </p>
            <p className="text-gray-400">
              Email:{' '}
              <a
                href="mailto:nikampratik2989@gmail.com"
                className="hover:text-white"
              >
                nikampratik2989@gmail.com
              </a>
            </p>
          </div>
        </div>
        <div>
      <Link to='/Feedbackreceive' className="text-gray-400 hover:text-white">
                  Feedback
                </Link>
     </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Divya Colour Home. All rights reserved.
          </p>
        </div>
      </div>
     
    </footer>
  )
}

export default Footer