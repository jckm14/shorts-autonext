# Shorts Auto-Next

An iPhone app that plays YouTube Shorts and moves to the next one automatically when each finishes. It loads YouTube's own mobile Shorts feed inside the app; a toggle in the top bar turns auto-advance on or off.

This is not on the App Store. You install it yourself ("sideloading") with your own Apple ID.

## Install on your iPhone

You need a Windows PC or Mac, a cable, and an Apple ID (free is fine).

1. Download **ShortsAutoNext.ipa** from the [latest release](https://github.com/jckm14/shorts-autonext/releases/latest).
2. Install [Sideloadly](https://sideloadly.io) on your computer and open it.
3. Plug in your iPhone, unlock it, and tap **Trust** if asked.
4. Drag `ShortsAutoNext.ipa` into Sideloadly, enter your Apple ID, and click **Start**.
5. On the iPhone, open **Settings → General → VPN & Device Management**, tap your Apple ID, and tap **Trust**.
6. If the app won't open, turn on **Settings → Privacy & Security → Developer Mode** and restart the phone.

With a free Apple ID the app stops opening after 7 days. Repeat step 4 to renew it, or use [AltStore](https://altstore.io), which can refresh it over Wi-Fi.

## Build it yourself

Open `ShortsAutoNext.xcodeproj` in Xcode on a Mac, choose your team under Signing & Capabilities, select your iPhone, and press Run.

## What's in here

- `ShortsAutoNext/` and `ShortsAutoNext.xcodeproj` — the iOS app (SwiftUI + WKWebView). `autonext.js` is the script that detects the end of a Short and advances.
- `.github/workflows/build-ipa.yml` — builds the unsigned `.ipa`; every push to `main` publishes it to the release for the current app version.
- `docs/` — an experimental Home Screen web app that plays Shorts from channels or playlists you add. It cannot show YouTube's own feed.

This project is not affiliated with YouTube or Google.
