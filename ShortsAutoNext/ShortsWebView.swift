import SwiftUI
import WebKit

struct ShortsWebView: UIViewRepresentable {
    let autoNext: Bool
    let reloadToken: Int

    private static let home = URL(string: "https://m.youtube.com/shorts")!

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.websiteDataStore = .default() // keeps you signed in between launches

        if let url = Bundle.main.url(forResource: "autonext", withExtension: "js"),
           let source = try? String(contentsOf: url, encoding: .utf8) {
            config.userContentController.addUserScript(
                WKUserScript(source: source, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
            )
        }

        let webView = WKWebView(frame: .zero, configuration: config)
        // Present as Mobile Safari so YouTube / Google sign-in serve the normal mobile site.
        webView.customUserAgent =
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
        webView.navigationDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.isOpaque = false
        webView.backgroundColor = .black
        webView.scrollView.backgroundColor = .black
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        context.coordinator.autoNext = autoNext
        context.coordinator.reloadToken = reloadToken
        webView.load(URLRequest(url: Self.home))
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        let c = context.coordinator
        if c.autoNext != autoNext {
            c.autoNext = autoNext
            c.applyEnabled(to: webView)
        }
        if c.reloadToken != reloadToken {
            c.reloadToken = reloadToken
            webView.load(URLRequest(url: Self.home))
        }
    }

    final class Coordinator: NSObject, WKNavigationDelegate {
        var autoNext = true
        var reloadToken = 0

        func applyEnabled(to webView: WKWebView) {
            webView.evaluateJavaScript("window.__sanEnabled = \(autoNext);", completionHandler: nil)
        }

        func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
            applyEnabled(to: webView)
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            applyEnabled(to: webView)
        }
    }
}
