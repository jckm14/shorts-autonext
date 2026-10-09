import SwiftUI

struct ContentView: View {
    @AppStorage("autoNextEnabled") private var autoNext = true
    @State private var reloadToken = 0

    var body: some View {
        ShortsWebView(autoNext: autoNext, reloadToken: reloadToken)
            .ignoresSafeArea(.container, edges: .bottom)
            .safeAreaInset(edge: .top, spacing: 0) {
                HStack(spacing: 12) {
                    Toggle(isOn: $autoNext) {
                        Label("Auto-next", systemImage: "forward.end.fill")
                            .font(.subheadline.weight(.semibold))
                    }
                    .tint(.red)
                    Button {
                        reloadToken += 1
                    } label: {
                        Image(systemName: "house.fill")
                    }
                    .accessibilityLabel("Back to Shorts feed")
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color.black)
                .foregroundStyle(.white)
            }
            .background(Color.black)
    }
}
