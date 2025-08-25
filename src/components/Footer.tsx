import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Disclaimer */}
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-200 text-sm leading-relaxed">
            <span className="font-medium">Disclaimer:</span> Our tool was developed to help users download videos and images posted by themselves. 
            However, we will refuse to provide services if you abuse the tool to violate the privacy rights or violate the intellectual property rights of others.
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 text-center">
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Important Notice</h3>
            <div className="text-white/80 text-sm space-y-2 max-w-4xl mx-auto">
              <p>1. InstaSave is an independent platform, developed and maintained by the InstaSave team. <span className="font-medium text-white">WE ARE NOT AFFILIATED WITH INSTAGRAM OR META.</span></p>
              <p>2. The InstaSave™ trademark is created by us solely for use in connection with the services, applications and websites we provide. InstaSave is read as one seamless word without mentioning any other person or organization.</p>
              <p>3. We display advertising to maintain and support research and development activities for non-commercial purposes. Our advertising partners may use cookies to optimize ad delivery. You can completely refuse cookies or stop using our services at any time.</p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold mb-4">InstaSave</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Download Tools</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Instagram Video Downloader</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Instagram Photo Downloader</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Instagram Reels Downloader</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Instagram Story Downloader</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><Link href="/help" className="hover:text-white transition-colors">Help</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/tutorial" className="hover:text-white transition-colors">How to Use</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2025 InstaSave. All rights reserved.
            </p>
            <p className="text-white/60 text-sm mt-2 md:mt-0">
              <span className="font-medium">We are not affiliated with Instagram or Meta.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
