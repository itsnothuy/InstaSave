import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Help & FAQ
            </h1>
            <p className="text-xl text-white/90">
              Everything you need to know about using InstaSave
            </p>
          </div>

          <div className="space-y-8">
            {/* How to Use */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">How to use InstaSave?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Copy Instagram URL</h3>
                  <p className="text-white/80 text-sm">
                    Open Instagram app or website, find the post/reel/story you want to download, 
                    and copy its URL
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Paste URL</h3>
                  <p className="text-white/80 text-sm">
                    Paste the copied URL into our input box and click the "Download" button
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Download</h3>
                  <p className="text-white/80 text-sm">
                    Choose your preferred quality and save the content to your device
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What is InstaSave?</h3>
                  <p className="text-white/80">
                    InstaSave is a free online tool that helps you download photos, videos, reels, 
                    and stories from Instagram to your phone or computer.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Is InstaSave free to use?</h3>
                  <p className="text-white/80">
                    Yes! InstaSave is completely free to use. You can download Instagram content 
                    without any limits or registration required.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Do I need to install any software?</h3>
                  <p className="text-white/80">
                    No installation required! InstaSave works directly in your web browser on any device - 
                    PC, Mac, iPhone, Android, or tablet.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Does InstaSave store my downloaded content?</h3>
                  <p className="text-white/80">
                    No, we don't store any of your downloaded content or keep copies. We also don't 
                    collect user data, making your usage completely anonymous and private.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Can I download private Instagram content?</h3>
                  <p className="text-white/80">
                    You can only download content that you have access to. For private accounts, 
                    you need to be following the account and have permission to view the content.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What quality options are available?</h3>
                  <p className="text-white/80">
                    InstaSave offers multiple quality options including High Quality (1080p+), 
                    Medium Quality (720p), and Low Quality (480p) for both images and videos.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">I can't find my downloaded files. Where are they?</h3>
                  <p className="text-white/80">
                    Check your device's "Downloads" folder or your browser's download history. 
                    On mobile devices, files are usually saved to the Downloads folder or Gallery.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Is it legal to download Instagram content?</h3>
                  <p className="text-white/80">
                    You should only download content that you own or have permission to save. 
                    Always respect copyright laws and the content creator's rights.
                  </p>
                </div>

              </div>
            </div>

            {/* Supported Formats */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Supported Content Types</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">✅ Supported</h3>
                  <ul className="space-y-2 text-white/80">
                    <li>📸 Instagram Photos</li>
                    <li>🎥 Instagram Videos</li>
                    <li>🎬 Instagram Reels</li>
                    <li>📱 Instagram Stories</li>
                    <li>📺 IGTV Videos</li>
                    <li>🖼️ Carousel Posts (Multiple Photos/Videos)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">❌ Not Supported</h3>
                  <ul className="space-y-2 text-white/80">
                    <li>🔒 Private Stories (without access)</li>
                    <li>📺 Instagram Live Videos</li>
                    <li>💬 Direct Messages</li>
                    <li>📞 Video Calls</li>
                    <li>🔔 Notifications</li>
                    <li>👥 Private Profile Content (without access)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
              <p className="text-white/80 mb-6">
                If you can't find the answer to your question here, feel free to contact us.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="mailto:support@instasave.app" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  📧 Email Support
                </a>
                <a 
                  href="#" 
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  💬 Live Chat
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
