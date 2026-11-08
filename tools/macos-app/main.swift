import Cocoa
import WebKit

private let storageDefaultsKey = "BronzeEyeLocalStorage_v1"

final class StorageBridge: NSObject, WKScriptMessageHandler {
    static let shared = StorageBridge()

    func loadAll() -> [String: String] {
        return (UserDefaults.standard.dictionary(forKey: storageDefaultsKey) as? [String: String]) ?? [:]
    }

    func saveAll(_ dict: [String: String]) {
        UserDefaults.standard.set(dict, forKey: storageDefaultsKey)
        UserDefaults.standard.synchronize()
    }

    func clearAll() {
        UserDefaults.standard.removeObject(forKey: storageDefaultsKey)
        UserDefaults.standard.synchronize()
    }

    func bootstrapScript() -> String {
        let dict = loadAll()
        let data = (try? JSONSerialization.data(withJSONObject: dict, options: [])) ?? Data("{}".utf8)
        let json = String(data: data, encoding: .utf8) ?? "{}"
        return """
        (() => {
          const store = new Map(Object.entries(\(json)));
          const sync = (op, key, value) => {
            try {
              window.webkit?.messageHandlers?.nativeStorage?.postMessage({ op, key, value });
            } catch {}
          };
          const customStorage = {
            getItem(k) { const s = String(k); return store.has(s) ? store.get(s) : null; },
            setItem(k, v) { const s = String(k), val = String(v); store.set(s, val); sync('set', s, val); },
            removeItem(k) { const s = String(k); store.delete(s); sync('remove', s, ''); },
            clear() { store.clear(); sync('clear', '', ''); },
            key(i) { return Array.from(store.keys())[i] ?? null; },
            get length() { return store.size; }
          };
          try {
            Object.defineProperty(window, 'localStorage', { value: customStorage, configurable: true });
          } catch {}
        })();
        """
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let op = body["op"] as? String else { return }
        var dict = loadAll()
        switch op {
        case "set":
            if let key = body["key"] as? String, let val = body["value"] as? String {
                dict[key] = val
                saveAll(dict)
            }
        case "remove":
            if let key = body["key"] as? String {
                dict.removeValue(forKey: key)
                saveAll(dict)
            }
        case "clear":
            clearAll()
        default:
            break
        }
    }
}

final class GameSchemeHandler: NSObject, WKURLSchemeHandler {
    private let mimeTypes: [String: String] = [
        "html": "text/html; charset=utf-8",
        "js": "application/javascript; charset=utf-8",
        "css": "text/css; charset=utf-8",
        "json": "application/json; charset=utf-8",
        "svg": "image/svg+xml",
        "png": "image/png",
        "webp": "image/webp",
        "mp4": "video/mp4",
        "webm": "video/webm"
    ]

    private func resolveFile(for relativePath: String) -> URL? {
        let clean = relativePath.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let rel = clean.isEmpty ? "index.html" : clean
        // 1. Prefer project directory alongside the .app bundle if present
        let externalRoot = Bundle.main.bundleURL.deletingLastPathComponent()
        let externalCandidate = externalRoot.appendingPathComponent(rel).standardizedFileURL
        if externalCandidate.path.hasPrefix(externalRoot.standardizedFileURL.path),
           FileManager.default.fileExists(atPath: externalCandidate.path) {
            var isDir: ObjCBool = false
            if FileManager.default.fileExists(atPath: externalCandidate.path, isDirectory: &isDir), !isDir.boolValue {
                return externalCandidate
            }
        }
        // 2. Fallback to embedded Resources/game inside .app bundle
        if let resRoot = Bundle.main.resourceURL?.appendingPathComponent("game") {
            let bundledCandidate = resRoot.appendingPathComponent(rel).standardizedFileURL
            if bundledCandidate.path.hasPrefix(resRoot.standardizedFileURL.path),
               FileManager.default.fileExists(atPath: bundledCandidate.path) {
                return bundledCandidate
            }
        }
        return nil
    }

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard let url = urlSchemeTask.request.url else {
            urlSchemeTask.didFailWithError(URLError(.badURL))
            return
        }
        let path = url.path.isEmpty || url.path == "/" ? "/index.html" : url.path
        guard let fileURL = resolveFile(for: path),
              var data = try? Data(contentsOf: fileURL) else {
            urlSchemeTask.didFailWithError(URLError(.fileDoesNotExist))
            return
        }

        let ext = fileURL.pathExtension.lowercased()
        if ext == "html", var html = String(data: data, encoding: .utf8) {
            let injection = "<script>\(StorageBridge.shared.bootstrapScript())</script>"
            if let headRange = html.range(of: "<head>") {
                html.insert(contentsOf: injection, at: headRange.upperBound)
                data = Data(html.utf8)
            }
        }

        let mime = mimeTypes[ext] ?? "application/octet-stream"
        let response = HTTPURLResponse(
            url: url,
            statusCode: 200,
            httpVersion: "HTTP/1.1",
            headerFields: [
                "Content-Type": mime,
                "Content-Length": "\(data.count)",
                "Cache-Control": "no-store",
                "Access-Control-Allow-Origin": "*"
            ]
        )!
        urlSchemeTask.didReceive(response)
        urlSchemeTask.didReceive(data)
        urlSchemeTask.didFinish()
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}
}

final class GameWebView: WKWebView {
    override var acceptsFirstResponder: Bool { true }
}

final class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate {
    var window: NSWindow!
    var webView: GameWebView!
    let schemeHandler = GameSchemeHandler()

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.appearance = NSAppearance(named: .darkAqua)
        buildMainMenu()

        let screenFrame = NSScreen.main?.visibleFrame ?? NSRect(x: 0, y: 0, width: 1600, height: 900)
        let targetWidth = min(1600, max(1120, floor(screenFrame.width * 0.88)))
        let targetHeight = round(targetWidth * 9.0 / 16.0)
        let rect = NSRect(x: 0, y: 0, width: targetWidth, height: targetHeight)

        window = NSWindow(
            contentRect: rect,
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "古蜀迷踪：青铜之眼"
        window.backgroundColor = NSColor(calibratedRed: 0.012, green: 0.035, blue: 0.051, alpha: 1.0)
        window.contentMinSize = NSSize(width: 960, height: 540)
        window.contentAspectRatio = NSSize(width: 16, height: 9)
        window.collectionBehavior = [.fullScreenPrimary, .managed]
        window.center()
        window.delegate = self

        let config = WKWebViewConfiguration()
        config.setURLSchemeHandler(schemeHandler, forURLScheme: "bronze")
        config.mediaTypesRequiringUserActionForPlayback = []
        config.userContentController.add(StorageBridge.shared, name: "nativeStorage")

        webView = GameWebView(frame: rect, configuration: config)
        webView.autoresizingMask = [.width, .height]
        webView.setValue(false, forKey: "drawsBackground")

        window.contentView = webView
        window.makeKeyAndOrderFront(nil)
        window.makeFirstResponder(webView)
        NSApp.activate(ignoringOtherApps: true)

        if let startURL = URL(string: "bronze://game/index.html") {
            webView.load(URLRequest(url: startURL))
        }
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

    @objc func reloadGame(_ sender: Any?) {
        if let startURL = URL(string: "bronze://game/index.html") {
            webView.load(URLRequest(url: startURL))
        }
    }

    @objc func resetSaveData(_ sender: Any?) {
        let alert = NSAlert()
        alert.messageText = "重置本地存档？"
        alert.informativeText = "这将清除当前保存的遗迹进度与田野手记，并重新载入主菜单。"
        alert.alertStyle = .warning
        alert.addButton(withTitle: "确认重置")
        alert.addButton(withTitle: "取消")
        if alert.runModal() == .alertFirstButtonReturn {
            StorageBridge.shared.clearAll()
            reloadGame(nil)
        }
    }

    @objc func setWindowSize1600(_ sender: Any?) {
        resizeWindow(width: 1600, height: 900)
    }

    @objc func setWindowSize1280(_ sender: Any?) {
        resizeWindow(width: 1280, height: 720)
    }

    private func resizeWindow(width: CGFloat, height: CGFloat) {
        guard !window.styleMask.contains(.fullScreen) else { return }
        window.setContentSize(NSSize(width: width, height: height))
        window.center()
    }

    private func buildMainMenu() {
        let mainMenu = NSMenu()

        // App menu
        let appMenuItem = NSMenuItem()
        mainMenu.addItem(appMenuItem)
        let appMenu = NSMenu()
        appMenuItem.submenu = appMenu
        appMenu.addItem(withTitle: "关于 古蜀迷踪：青铜之眼", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        let reloadItem = NSMenuItem(title: "重新载入画面", action: #selector(reloadGame(_:)), keyEquivalent: "r")
        reloadItem.target = self
        appMenu.addItem(reloadItem)
        let resetItem = NSMenuItem(title: "重置游戏存档…", action: #selector(resetSaveData(_:)), keyEquivalent: "\u{08}")
        resetItem.keyEquivalentModifierMask = [.command, .shift]
        resetItem.target = self
        appMenu.addItem(resetItem)
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "隐藏 古蜀迷踪：青铜之眼", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        let hideOthers = NSMenuItem(title: "隐藏其他", action: #selector(NSApplication.hideOtherApplications(_:)), keyEquivalent: "h")
        hideOthers.keyEquivalentModifierMask = [.command, .option]
        appMenu.addItem(hideOthers)
        appMenu.addItem(withTitle: "全部显示", action: #selector(NSApplication.unhideAllApplications(_:)), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "退出 古蜀迷踪：青铜之眼", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")

        // View menu
        let viewMenuItem = NSMenuItem()
        mainMenu.addItem(viewMenuItem)
        let viewMenu = NSMenu(title: "视图")
        viewMenuItem.submenu = viewMenu
        let fullScreenItem = NSMenuItem(title: "进入/退出全屏", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f")
        fullScreenItem.keyEquivalentModifierMask = [.command, .control]
        viewMenu.addItem(fullScreenItem)
        viewMenu.addItem(NSMenuItem.separator())
        let size1600 = NSMenuItem(title: "标准尺寸 (1600 × 900)", action: #selector(setWindowSize1600(_:)), keyEquivalent: "1")
        size1600.target = self
        viewMenu.addItem(size1600)
        let size1280 = NSMenuItem(title: "紧凑尺寸 (1280 × 720)", action: #selector(setWindowSize1280(_:)), keyEquivalent: "2")
        size1280.target = self
        viewMenu.addItem(size1280)

        // Window menu
        let windowMenuItem = NSMenuItem()
        mainMenu.addItem(windowMenuItem)
        let windowMenu = NSMenu(title: "窗口")
        windowMenuItem.submenu = windowMenu
        windowMenu.addItem(withTitle: "最小化", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
        windowMenu.addItem(withTitle: "缩放", action: #selector(NSWindow.performZoom(_:)), keyEquivalent: "")

        NSApp.mainMenu = mainMenu
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let delegate = AppDelegate()
app.delegate = delegate
app.run()
