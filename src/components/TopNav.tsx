import { Bell, LogOut, SettingsIcon } from "lucide-react";

function TopNav({ active, onNav }) {
    return (
        <header className="sticky top-0 z-10 border-b border-line bg-paper">
            <div className="max-w-230 mx-auto flex items-center justify-between px-6 py-4">
                {/* <Wordmark size={18} /> */}
                <div className="flex items-center gap-1">
                    <NavBtn
                        active={active === "dashboard"}
                        onClick={() => onNav("dashboard")}
                        icon={<Bell size={14} />}
                        label="Dashboard"
                    />
                    <NavBtn
                        active={active === "settings"}
                        onClick={() => onNav("settings")}
                        icon={<SettingsIcon size={14} />}
                        label="Settings"
                    />
                    <NavBtn
                        onClick={() => onNav("landing")}
                        icon={<LogOut size={14} />}
                        label="Log out"
                    />
                </div>
            </div>
        </header>
    );
}

function NavBtn({ active, onClick, icon, label }) {
    return (
        <button 
        onClick={onClick} 
        // fontFamily: "'Inter', sans-serif",
        className={
            `flex items-center gap-1.5 text-sm font-semibold ${active ? "text-ink bg-paper-dim" : "text-ink-soft"} border-none rounded-lg px-3 py-2 transition cursor-pointer`
        }>
            {icon} {label}
        </button>
    );
}

export default TopNav