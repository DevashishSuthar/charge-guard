function NotificationSetup() {
  const [pushOn, setPushOn] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false);

  return (
    <div style={{ minHeight: "100%", background: COLORS.paper, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: 460, background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 32 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, background: COLORS.tealSoft,
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18
        }}>
          <Bell size={19} color={COLORS.teal} />
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: COLORS.ink, margin: 0 }}>
          Where should reminders land?
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: COLORS.inkSoft, lineHeight: 1.6, marginTop: 8 }}>
          Turn on at least one channel. You can use both — Telegram is optional but works even if you clear your browser data.
        </p>

        {/* Browser push - primary */}
        <div style={{
          marginTop: 22, border: `1px solid ${pushOn ? COLORS.teal : COLORS.line}`, borderRadius: 10,
          padding: 16, background: pushOn ? COLORS.tealSoft : "#fff"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, background: pushOn ? "#fff" : COLORS.paperDim,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Bell size={16} color={COLORS.ink} />
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.ink }}>
                  Browser push
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: COLORS.inkSoft, marginTop: 2, maxWidth: 280 }}>
                  Recommended default — works even if you never touch Telegram.
                </div>
              </div>
            </div>
            <button onClick={() => setPushOn(v => !v)} style={{
              fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600,
              color: pushOn ? "#fff" : COLORS.ink, background: pushOn ? COLORS.teal : COLORS.paperDim,
              border: "none", borderRadius: 6, padding: "7px 14px", cursor: "pointer", flexShrink: 0
            }}>
              {pushOn ? "Enabled" : "Enable"}
            </button>
          </div>
        </div>

        {/* Telegram - optional, expandable */}
        <div style={{
          marginTop: 12, border: `1px solid ${telegramConnected ? COLORS.teal : COLORS.line}`, borderRadius: 10,
          padding: 16, background: telegramConnected ? COLORS.tealSoft : "#fff"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, background: telegramConnected ? "#fff" : COLORS.paperDim,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Send size={16} color={COLORS.ink} />
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.ink }}>
                  Telegram <span style={{ color: COLORS.inkSoft, fontWeight: 500 }}>· optional</span>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: COLORS.inkSoft, marginTop: 2, maxWidth: 280 }}>
                  A second, more durable channel. Good if you're not always on this browser.
                </div>
              </div>
            </div>
            {!telegramConnected && (
              <button onClick={() => setTelegramOpen(v => !v)} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink,
                background: COLORS.paperDim, border: "none", borderRadius: 6, padding: "7px 14px", cursor: "pointer", flexShrink: 0
              }}>
                {telegramOpen ? "Hide" : "Set up"}
              </button>
            )}
          </div>

          {telegramOpen && !telegramConnected && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${COLORS.line}` }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Step n={1} text={<>Message <b>@ParchiReminderBot</b> on Telegram</>} />
                <Step n={2} text={<>Send <code style={codeStyle}>/start</code> — it replies with your chat ID</>} />
                <Step n={3} text="Paste that ID below" />
              </div>
              <div style={{ marginTop: 14 }}>
                <Field label="Telegram chat ID" placeholder="e.g. 5839201744" type="text" />
              </div>
              <button onClick={() => setTelegramConnected(true)} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff",
                background: COLORS.ink, border: "none", borderRadius: 7, padding: "9px 16px", cursor: "pointer"
              }}>
                Connect
              </button>
            </div>
          )}
        </div>

        {!pushOn && !telegramConnected && (
          <div style={{
            marginTop: 14, fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: COLORS.amber,
            background: COLORS.amberSoft, borderRadius: 8, padding: "10px 12px"
          }}>
            Nothing's on yet — you won't get reminded until you enable at least one channel.
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onDone} style={{
            flex: 1, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff",
            background: COLORS.ink, border: "none", borderRadius: 8, padding: "11px 0", cursor: "pointer"
          }}>
            Continue
          </button>
          <button onClick={onSkip} style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.inkSoft,
            background: "transparent", border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "11px 16px", cursor: "pointer"
          }}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationSetup